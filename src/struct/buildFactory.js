import buildStruct    from "./buildStruct"
import noop           from "@stdlib/utils/noop"
import importContents from "./contents/importContents"

export default function buildFactory(defaultContents, operators, initializer = noop) {
    const factoryStruct = buildStruct({
        defaultContents, operators, initializer
    }, {
        build(contents) {
            // todo make sure that shape matches between contents and the defaults

            return buildStruct({
                ...this.defaultContents,
                ...contents
            }, this.operators, this.initializer, {typeIds: this.__isTypeOf, factory: this})
        },

        mixWith(other) {
            this.mix(other.__factory.defaultContents, other.__factory.operators, other.__factory.initializer)
        },

        mix(oDefaultContents, oOperators, oInitializer) {
            const _self = this
            const initializer = this.initializer
            return buildFactory(
                {...this.defaultContents, ...oDefaultContents},
                {...this.operators, ...oOperators},
                () => {
                    _self.initializer && initializer.bind(this)()
                    oInitializer && oInitializer.bind(this)()

                    // fixme. make awaitable
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
    // todo
    // factory.addCompanionOps
    factory.fromContents = factoryStruct.fromContents
    factory.__factory = factoryStruct

    return factory
}
