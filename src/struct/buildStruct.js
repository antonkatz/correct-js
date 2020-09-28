import {protect}     from "./protect"
import checkContents from "./checkContents"

/** Creates a new struct given the shape of the data (aka contents) that it holds and the operations that can be performed on those contents.
 *
 * Structs must have all the contents values defined, and the data can only be changed through calling an operation.
 * */
export default function (defaultContents, operators, typeId = null) {
    checkContents(defaultContents)

    //fixme. shallow copy of `defaultContents` does not guarantee that some code
    // elsewhere is not going change inner values (such as pushing into an array)

    const struct =
        Object.create(operators, /* the proxy object can be set directly here */) |>
        Object.assign(?, defaultContents, {__typeId: typeId})

    if (process?.env?.NODE_ENV !== 'production') {
        return protect(struct)
    } else {
        return struct
    }
}
