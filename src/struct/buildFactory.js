import buildStruct   from "./buildStruct"
import checkContents from "./checkContents"

export default function (defaultContents, operators, initializer = null) {
    checkContents(defaultContents)

    const typeId = Symbol()

    function factory(contents = {}) {
        // todo make sure that shape matches between contents and the defaults

        const struct = buildStruct({
            ...defaultContents,
            ...contents
        }, operators, typeId)

        initializer && initializer(struct)

        return struct
    }

    factory.is = function (what) {
        return what.__isTypeOf.includes(typeId)
    }

    return factory
}
