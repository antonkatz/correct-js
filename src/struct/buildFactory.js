import buildStruct   from "./buildStruct"
import checkContents from "./checkContents"
import mixin         from "./mixin"
import noop from "@stdlib/utils/noop"

export default function buildFactory (defaultContents, operators, initializer = noop) {
    const factoryStruct = buildStruct({
        defaultContents, operators, initializer
    }, {
        build(contents) {
            // todo make sure that shape matches between contents and the defaults

            return buildStruct({
                ...this.defaultContents,
                ...contents
            }, this.operators, this.initializer, this.__isTypeOf)
        },

        mixin(other) {
            const initializer = this.initializer
            return buildFactory(
                {...this.defaultContents, ...other.__factory.defaultContents},
            {...this.operators, ...other.__factory.operators},
                () => {
                initializer()
                other.__factory.initializer()

                // fixme. make awaitable
            })
        }
    })

    return makeCallable(factoryStruct)
}

function makeCallable(factoryStruct) {
    function factory(contents = {}) {
        return factoryStruct.build(contents)
    }

    factory.mixin = factoryStruct.mixin.bind(factoryStruct)
    factory.__factory = factoryStruct

    return factory
}
