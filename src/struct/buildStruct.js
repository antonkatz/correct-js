import {isFunction}                                                              from '@stdlib/assert'
import buildContentsGetter                                                       from "./contents/buildContentsGetter"
import {nullify}                                                                 from "./initialization/nullifyStruct"
import {checkContentsOpt, checkInitializationOpt, protectOpt, protectPromiseOpt} from "./protect/optionals"
import getDefaults                                                               from "./contents/getDefaults"

/** Creates a new struct given the shape of the data (aka contents) that it holds and the operations that can be performed on those contents.
 *
 * Structs must have all the contents values defined, and the data can only be changed through calling an operation.
 * */
export default function (contents, operators, initializer = null,
                         {typeIds = [], factory = null,
                             additionalPrototype = {}, postCreate = (struct) => struct} = {}) {
    // defaults might be a function
    const defaultContents = factory ? getDefaults(factory.defaultContents) : null
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
        },
        ...additionalPrototype
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

    // todo allow external access to props without $

    return Object.create(prototype, /* the proxy object can be set directly here */) |>
        // bindAll |>
        Object.assign(?, properties) |>
        postCreate |>
        protectOpt(?, false) |>
        initialize(?, initializer, defaultContents)
}

/** Allows for awaitable and nullable constructors */
function initialize(struct, initializer, defaultContents) {
    if (initializer) {
        // important, otherwise will be bound to the factory
        // struct.__initializer = struct.__initializer.bind(struct)
        const ready = initializer.bind(struct)(struct)
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
