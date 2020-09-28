import buildStruct from "./buildStruct"

export default function (defaultContents, operators) {
    const typeId = Symbol()

    function factory() {
        return buildStruct(defaultContents, operators, typeId)
    }

    factory.is = function (what) {
        return what.__typeId === typeId
    }

    return factory
}
