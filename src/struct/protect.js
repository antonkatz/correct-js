import {isFunction} from '@stdlib/assert'

/** [During development] it is beneficial to make sure that getting non-existent properties halts the program,
 * as well as changing data externally should also halt the program. */
export default function protect(struct, noSet = true) {
    const handler = {
        get: strictGet,
    }

    if (noSet) {
        handler.set = function (target, name, receiver) {
            throw new SyntaxError('Structs can only be changed by inner operations, they cannot be modified by external calls')
        }
    }

    return new Proxy(struct, handler)
}

/** Makes sure that the properties exists on the struct */
function strictGet(target, name, receiver) {
    if (!(name in target)) {
        const msg = 'Struct has no such property: ' + name
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
