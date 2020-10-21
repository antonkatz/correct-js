import {isFunction}          from '@stdlib/assert'
import getSettableProperties from "../getSettableProperties"
import {strictPropertyGet}   from "./strictPropertyGet"
import isStruct              from "../isStruct"
import {getTargetTrap}       from "./expose"

//todo.
// add a `shed` feature (invalidate currently held pointers) [done by returning a new proxy]


/** [During development] it is beneficial to make sure that getting non-existent properties halts the program,
 * as well as changing data externally should also halt the program. */
export default function protect(struct, external = true, {setOnly = [false]} = {}) {
    const settableKeys = setOnly[0] !== false ? setOnly : getSettableProperties(struct)

    const handler = {
        __isExternal: external,
        get: strictGet,
    }
    handler.set = function (target, name, value, receiver) {
        if (external) {
            throw new SyntaxError('Structs can only be changed by inner operations, they cannot be modified by external calls')
        } else {
            // todo. ??? lax the restriction for internal function start with __
            if (!settableKeys.includes(name)) {
                throw new SyntaxError(`Not allowed to set key ${name}. Does it exist?`)
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
    const _target = getTargetTrap(target, name)
    if (_target) return _target

    let v = strictPropertyGet(target, name, receiver)

    // the struct check is a must, otherwise is function fails
    if (!isStruct(v) && isFunction(v)) {
        const protoKeys = Object.keys(Object.getPrototypeOf(target))
        if (protoKeys.includes(name)) {
            // only with prototype functions
            // wrapping the struct into a strictGet proxy only, thus allowing the ops to set values
            // while still checking for correctness of access
            v = v.bind(new Proxy(target, {get: strictGet})) // fixme restrict which keys can be set
        }
    }
    return v
}

