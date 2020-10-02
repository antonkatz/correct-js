import protect             from "./protect"
import checkContents       from "./checkContents"
import checkInitialization from "./checkInitialization"
import {isFunction}        from '@stdlib/assert'
import buildContentsGetter from "./contents/buildContentsGetter"

/** Creates a new struct given the shape of the data (aka contents) that it holds and the operations that can be performed on those contents.
 *
 * Structs must have all the contents values defined, and the data can only be changed through calling an operation.
 * */
export default function (contents, operators, initializer = null,
                         {typeIds = [], factory = null} = {}) {
    checkContentsOpt(contents, factory ? factory.defaultContents : null)

    const structId = Symbol()
    typeIds = typeIds.length > 0 ? typeIds : [structId]

    //fixme. shallow copy of `contents` does not guarantee that some code
    // elsewhere is not going change inner values (such as pushing into an array)

    const getContents = buildContentsGetter(contents)
    const prototype = {
        ...operators,
        get Contents() {
            return getContents(this)
        }
    }
    if (factory) prototype.__factory == factory

    const properties = {
        ...contents,
        __structId: structId,
        __isTypeOf: typeIds,
        // __getContents: buildContentsGetter(contents)
        // __operators: operators,
        // __initializer: initializer,
    }

    return Object.create(prototype, /* the proxy object can be set directly here */) |>
        bindAll |>
        Object.assign(?, properties) |>
        initialize(?, initializer) |>
        checkInitializationOpt
}

/* fixme. ??? make a handler getter for functions */
function bindAll(struct) {
    for (const prop in struct) {
        const v = struct[prop]
        if (isFunction(v)) struct[prop] = v.bind(struct)
    }
    return struct
}

/** Allows for awaitable and nullable constructors */
function initialize(struct, initializer) {
    if (initializer) {
        // important, otherwise will be bound to the factory
        // struct.__initializer = struct.__initializer.bind(struct)
        const ready = initializer.bind(protectOpt(struct, false))(struct)
        if (ready?.then) {
            const p = Promise.resolve(ready)
            const n = p.then(nullify(?, struct))
            return n.then(protectOpt)
        } else {
            return nullify(ready, struct) |> protectOpt
        }
    } else {
        return protectOpt(struct)
    }
}

function nullify(initializerResult, struct) {
    if (initializerResult !== undefined && !initializerResult) {
        return undefined
    }
    return struct
}

const IS_PROD = process?.env?.NODE_ENV === 'production' ||
    process?.env?.CORRECT_JS_ENV === 'production'

function protectOpt(struct, noSet = true) {
    if (!IS_PROD && struct !== undefined) {
        return protect(struct, noSet)
    } else {
        return struct
    }
}

function checkContentsOpt(contents, defaults = null) {
    if (!IS_PROD) {
        // throws
        checkContents(contents, defaults)
    }
}

function checkInitializationOpt(struct) {
    if (!IS_PROD && struct !== undefined) {
        // throws
        checkInitialization(struct)
    }
    return struct
}

