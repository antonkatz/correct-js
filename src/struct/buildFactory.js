import buildStruct                        from "./buildStruct"
import noop                               from "@stdlib/utils/noop"
import bifurcateBy                        from "@stdlib/utils/bifurcate-by"
import importContents                                    from "./contents/importContents"
import {shouldNullifyStruct, shouldNullifyStructPromise} from "./initialization/nullifyStruct"
import {protectOperationsOpt, protectOpt}                from "./protect/optionals"
import getDefaults                        from "./contents/getDefaults"
import buildContentsWithDefaults          from "./contents/buildContentsWithDefaults"
import checkPreBuildContents              from "./contents/checkPreBuildContents"
import {combineDefaultContents_strict}    from "./contents/combineDefaults"

export default function buildFactory(defaultContents, operators,
                                     initializer = noop,
                                     {typeIds = [], additionalPrototype = {}, } = {}) {
    const factoryStruct = buildStruct({
        defaultContents, operators, initializer,
    }, {
        build(contents) {
            checkPreBuildContents(contents)
            // todo make sure that shape matches between contents and the defaults
            // DONEish, todo make sure that contents aren't overwriting vars starting with $

            return buildStruct(
                buildContentsWithDefaults(contents, this.defaultContents),
                this.operators,
                this.initializer,
                {
                    typeIds: typeIds.length > 0 ? typeIds : this.__isTypeOf,
                    factory: this,
                    additionalPrototype,
                    postCreate(struct) {
                        if (additionalPrototype.$) {
                            const bound = {}
                            for (const [k, v] of Object.entries(struct.$)) {
                                bound[k] = v.bind(struct)
                            }
                            struct.$ = bound
                        }
                        return struct
                    }
                })
        },

        mixWith(other) {
            return this.mix(other.__factory.defaultContents, other.__factory.operators, other.__factory.initializer)
        },

        mix(oDefaultContents, oOperators, oInitializer) {
            const _thisFactory = this
            const _thisInitializer = this.initializer

            const _thisDefaults = getDefaults(this.defaultContents)
            const _otherDefaults = getDefaults(oDefaultContents)

            // fixme. each layer should only be able to access itself
            const _thisOperators = protectOperationsOpt(this.operators, Object.keys(_thisDefaults))
            const _otherOperators = protectOperationsOpt(oOperators, Object.keys(_otherDefaults))

            // if the top layer wants access to a bottom layer vars, but doesn't want to change their defaults, then it
            // should set its own default as `undef`
            const combinedDefaultContents = combineDefaultContents_strict(_thisDefaults, _otherDefaults)

            return buildFactory(
                {...combinedDefaultContents},
                {..._thisOperators, ..._otherOperators}, // fixme prevent access to non-self-declared vars
                function () {
                    // defaulting to undefined to make sure that nullification happens correctly
                    // protecting by layer allows to access only self defined functions

                    const _runInitialize = runInitialize.bind(this)

                    // there are not true `then`, each is only executed if should not be nullified
                    return shouldNullifyStructPromise(_runInitialize(
                        _thisInitializer, _thisDefaults, _thisOperators
                    )).then(() => shouldNullifyStructPromise(_runInitialize(
                        oInitializer, _otherDefaults, _otherOperators
                    ))).then(() => true)
                }, {
                    typeIds: [..._thisFactory.__isTypeOf, Symbol()],
                    additionalPrototype: {$: _thisOperators}, // allowing for lower level access
                })
        },


        fromContents(contents) {
            const remappedContents = importContents(contents, this.defaultContents)
            return buildStruct({
                ...this.defaultContents,
                ...remappedContents
            }, this.operators, null, {typeIds: this.__isTypeOf, factory: this})
        }
    })

    return makeCallable(factoryStruct)
}

// todo. Static ops / non-object ops can be added onto the function or produced by Factory(factory_child) = static ops

function makeCallable(factoryStruct) {
    const build = factoryStruct.build.bind(factoryStruct)
    function factory(contents = {}) {
        return build(contents)
    }

    factory.mixWith = factoryStruct.mixWith.bind(factoryStruct)
    factory.mix = factoryStruct.mix.bind(factoryStruct)
    factory.layer = factoryStruct.mix.bind(factoryStruct)

    // todo
    // factory.addCompanionOps
    factory.fromContents = factoryStruct.fromContents.bind(factoryStruct)
    factory.__factory = factoryStruct

    return factory
}

function protectLayeredAccess(_this, defaultContents, ops) {
    // todo, access only
    return protectOpt(_this, false, {setOnly: Object.keys(defaultContents)})
}

function runInitialize(initializer, defaults, ops) {
    return initializer ? initializer.bind(protectLayeredAccess(this, defaults, ops))() : undefined
}
