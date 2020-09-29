import {protect}     from "./protect"
import checkContents from "./checkContents"

/** Creates a new struct given the shape of the data (aka contents) that it holds and the operations that can be performed on those contents.
 *
 * Structs must have all the contents values defined, and the data can only be changed through calling an operation.
 * */
export default function (contents, operators, initializer = null, typeIds = []) {
    checkContents(contents)

    const structId = Symbol()
    typeIds = typeIds.length > 0 ? typeIds : [structId]

    //fixme. shallow copy of `defaultContents` does not guarantee that some code
    // elsewhere is not going change inner values (such as pushing into an array)

    const struct = Object.create({
        ...operators,

        __structId: structId,
        __isTypeOf: typeIds,
        __operators: operators,
        __initializer: initializer
    }, /* the proxy object can be set directly here */) |>
        Object.assign(?, contents) |>
        initialize

    if (process?.env?.NODE_ENV !== 'production') {
        return protect(struct)
    } else {
        return struct
    }
}

/** Allows for awaitable constructors */
function initialize(struct) {
    if (struct.__initializer) {
        const ready = struct.__initializer()
        if (ready?.then) {
            return Promise.resolve(ready).then(struct)
        } else {
            return struct
        }
    } else {
        return struct
    }
}
