import buildStruct                        from "./buildStruct"
import noop                               from "@stdlib/utils/noop"
import bifurcateBy                        from "@stdlib/utils/bifurcate-by"
import importContents                     from "./contents/importContents"
import {shouldNullifyStruct}              from "./initialization/nullifyStruct"
import {protectOperationsOpt, protectOpt} from "./protect/optionals"

export default function buildFactory(defaultContents, operators,
                                     initializer = noop,
                                     {typeIds = [], additionalPrototype = {}, } = {}) {
    const factoryStruct = buildStruct({
        defaultContents, operators, initializer,
    }, {
        build(contents) {
            // todo make sure that shape matches between contents and the defaults

            return buildStruct({
                    ...this.defaultContents,
                    ...contents
                }, this.operators, this.initializer,
                {
                    typeIds: typeIds.length > 0 ? typeIds : this.__isTypeOf,
                    factory: this,
                    additionalPrototype,
                    postCreate(struct) {
                        if (additionalPrototype.$) {
                            for (const [k, v] of Object.entries(struct.$)) {
                                struct.$[k] = v.bind(struct)
                            }
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
            const initializer = this.initializer

            // fixme. each layer should only be able to access itself
            const _thisOperators = protectOperationsOpt(this.operators, Object.keys(this.defaultContents))
            const _otherOperators = protectOperationsOpt(oOperators, Object.keys(oDefaultContents))

            // if the top layer wants access to a bottom layer vars, but doesn't want to change their defaults, then it
            // should set its own default as `undef`
            const combinedDefaultContents = Object.keys(this.defaultContents)
                .concat(Object.keys(oDefaultContents))
                |> (ks => new Set(ks))
                |> Array.from
                |> (ks => ks.map(k => {
                const v = oDefaultContents[k] === undefined ? _thisFactory.defaultContents[k] : oDefaultContents[k]

                if (oDefaultContents[k] !== undefined && _thisFactory.defaultContents[k] !== undefined) {
                    throw new Error("Cannot overwrite default values of a lower layer")
                }
                return [k, v]
            }))
                |> Object.fromEntries

            return buildFactory(
                {...combinedDefaultContents},
                {..._thisOperators, ..._otherOperators}, // fixme prevent access to non-self-declared vars
                function () {
                    // defaulting to undefined to make sure that nullification happens correctly
                    // protecting by layer allows to access only self defined functions
                    const si = _thisFactory.initializer ?
                        initializer.bind(protectLayeredAccess(this, _thisFactory.defaultContents, _thisOperators))() : undefined
                    const oi = oInitializer ?
                        oInitializer.bind(protectLayeredAccess(this, oDefaultContents, _otherOperators))() : undefined

                    const [toAwait, sync] = bifurcateBy([si, oi], i => i && !!i.then)
                    const syncNull = sync.map(shouldNullifyStruct).includes(true)

                    // returning false will not create the struct
                    if (toAwait.length > 0) {
                        if (syncNull) return Promise.resolve(false)

                        return Promise.all(toAwait)
                            .then(asyncRes => asyncRes.map(shouldNullifyStruct).includes(true))
                            .then(asyncNull => !asyncNull)
                    } else {
                        if (syncNull) return false
                    }
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
    function factory(contents = {}) {
        return factoryStruct.build(contents)
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
