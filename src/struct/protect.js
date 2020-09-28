import {isFunction} from '@stdlib/assert'

/** [During development] it is beneficial to make sure that getting non-existent properties halts the program,
 * as well as changing data externally should also halt the program. */
export function protect(struct) {
    return new Proxy(struct, {
        get: strictGet,

        set: function (target, name, receiver) {
            throw new SyntaxError('Structs can only be changed by inner operations, they cannot be modified by external calls')
        }
    })
}

/** Makes sure that the properties exists on the struct */
function strictGet (target, name, receiver) {
    if (!(name in target)) {
        throw new TypeError('Struct has no such property: ' + name)
    }
    let v = target[name]
    if (isFunction(v)) {
        // wrapping the struct into a strictGet proxy only, thus allowing the ops to set values
        // while still checking for correctness of access
        v = v.bind(new Proxy(target, {get: strictGet}))
    }
    return v
}
