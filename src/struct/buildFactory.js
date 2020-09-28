import buildStruct from "./buildStruct"

export default function (defaultContents, operators) {
    const typeId = Symbol()

    function factory(contents = {}) {
        // todo make sure that shape matches between contents and the defaults

        return buildStruct({
            ...defaultContents,
            ...contents
        }, operators, typeId)
    }

    factory.is = function (what) {
        return what.__isTypeOf.includes(typeId)
    }

    return factory
}
