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

        mixin(other) {
            const _self = this
            const initializer = this.initializer
            return buildFactory(
                {...this.defaultContents, ...other.__factory.defaultContents},
                {...this.operators, ...other.__factory.operators},
                () => {
                    _self.initializer && initializer.bind(this)()
                    other.__factory.initializer && other.__factory.initializer.bind(this)()

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


function makeCallable(factoryStruct) {
    function factory(contents = {}) {
        return factoryStruct.build(contents)
    }

    factory.mixin = factoryStruct.mixin.bind(factoryStruct)
    factory.fromContents = factoryStruct.fromContents
    factory.__factory = factoryStruct

    return factory
}
