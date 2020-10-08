import protect             from "./protect/protect"
import checkContents       from "./checkContents"
import checkInitialization from "./checkInitialization"
import {isFunction}        from '@stdlib/assert'
import buildContentsGetter from "./contents/buildContentsGetter"
import {nullify}           from "./initialization/nullifyStruct"
import protectPromise      from "./protect/protectPromise"

/** Creates a new struct given the shape of the data (aka contents) that it holds and the operations that can be performed on those contents.
 *
 * Structs must have all the contents values defined, and the data can only be changed through calling an operation.
 * */
export default function (contents, operators, initializer = null,
                         {typeIds = [], factory = null} = {}) {
    const defaultContents = factory ? factory.defaultContents : null
    checkContentsOpt(contents, defaultContents)

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
    if (factory) prototype.__factory = factory

    const properties = {
        ...contents,
        __structId: structId,
        __isTypeOf: typeIds,
        // __getContents: buildContentsGetter(contents)
        // __operators: operators,
        // __initializer: initializer,
    }

    return Object.create(prototype, /* the proxy object can be set directly here */) |>
        // bindAll |>
        Object.assign(?, properties) |>
        initialize(?, initializer, defaultContents)
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
function initialize(struct, initializer, defaultContents) {
    if (initializer) {
        // important, otherwise will be bound to the factory
        // struct.__initializer = struct.__initializer.bind(struct)
        const ready = initializer.bind(protectOpt(struct, false))(struct)
        if (ready?.then) {
            const p = Promise.resolve(ready)
            const n = p.then(nullify(?, struct))
            return n.then(checkInitializationOpt(?, defaultContents)).then(protectOpt) |> protectPromiseOpt
        } else {
            return nullify(ready, struct) |> checkInitializationOpt(?, defaultContents) |> protectOpt
        }
    } else {
        return checkInitializationOpt(struct, defaultContents) |> protectOpt
    }
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

function protectPromiseOpt(p) {
    if (!IS_PROD) {
        return protectPromise(p)
    } else {
        return p
    }
}

function checkContentsOpt(contents, defaults = null) {
    if (!IS_PROD) {
        // throws
        checkContents(contents, defaults)
    }
}

function checkInitializationOpt(struct, defaultContents = null) {
    if (!IS_PROD && struct !== undefined) {
        // throws
        checkInitialization(struct, defaultContents)
    }
    return struct
}

