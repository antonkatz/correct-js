import {strictPropertyGet} from "./strictPropertyGet"
import {isFunction}          from '@stdlib/assert'

export default function (promise) {
    return new Proxy(promise, {
        get(target, name, receiver) {
            const v = strictPropertyGet(target, name, receiver, "Struct is not resolved. Tried to call method on a promise: ")
            if (isFunction(v)) {
                return v.bind(target)
            }
        }
    })
}
