import {isFunction}          from '@stdlib/assert'
import getSettableProperties from "./getSettableProperties"

/** [During development] it is beneficial to make sure that getting non-existent properties halts the program,
 * as well as changing data externally should also halt the program. */
export default function protect(struct, external = true) {
    const settableKeys = getSettableProperties(struct)

    const handler = {
        get: strictGet,
    }
    handler.set = function (target, name, value, receiver) {
        if (external) {
            throw new SyntaxError('Structs can only be changed by inner operations, they cannot be modified by external calls')
        } else {
            if (!settableKeys.includes(name)) {
                throw new SyntaxError(`Not allowed to set key ${k}`)
            } else {
                target[name] = value
                return true
            }
        }
    }

    return new Proxy(struct, handler)
}

/** Makes sure that the properties exists on the struct */
function strictGet(target, name, receiver) {
    if (!(name in target)) {
        let msg = 'Struct has no such property: '
        try {
            msg += name.toString()
        } catch (e) {
            console.warn("Could not provide key because", e)
        }
        const error = new TypeError(msg)

        const relevantTrace = error.stack.split('\n').slice(2)

        // if the stack trace is absent, and the function call is `then` -- skip
        let skip = relevantTrace.length === 0 && name === 'then'
        for (const line of relevantTrace) {
            if (line.includes('/') &&
                (line.includes('/node_modules/') || line.includes("internal/process"))) {
                skip = true
                break
            }
        }
        if (skip) {
            console.info(msg, error.stack)
        } else {
            debugger
            console.error(msg)
            throw error
        }
    }
    let v = target[name]
    if (isFunction(v)) {
        const protoKeys = Object.keys(Object.getPrototypeOf(target))
        if (protoKeys.includes(name)) {
            // only with prototype functions
            // wrapping the struct into a strictGet proxy only, thus allowing the ops to set values
            // while still checking for correctness of access
            v = v.bind(new Proxy(target, {get: strictGet}))
        }
    }
    return v
}
