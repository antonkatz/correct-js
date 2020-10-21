import {IS_PROD}           from "./env"
import protect             from "./protect"
import checkContents       from "../checkContents"
import protectPromise      from "./protectPromise"
import checkInitialization from "../checkInitialization"
import {exposeTarget}      from "./expose"
const mapValues = require( '@stdlib/utils/map-values' );


export function protectOpt(struct, noSet = true, {setOnly = [false]} = {}) {
    if (!IS_PROD && struct !== undefined) {
        // fixme extract proxy around it
        return protect(struct, noSet, {setOnly})
    } else {
        return struct
    }
}

export function protectPromiseOpt(p) {
    if (!IS_PROD) {
        return protectPromise(p)
    } else {
        return p
    }
}

export function checkContentsOpt(contents, defaults = null) {
    if (!IS_PROD) {
        // throws
        checkContents(contents, defaults)
    }
}

export function checkInitializationOpt(struct, defaultContents = null) {
    if (!IS_PROD && struct !== undefined) {
        // throws
        checkInitialization(struct, defaultContents)
    }
    return struct
}

export function protectOperationsOpt(ops, setOnly) {
    if (IS_PROD) return ops

    const _ops = {}
    for (const k of Object.keys(ops)) {
        const op = ops[k]
        _ops[k] = function (...params) {
            const _this = exposeTarget(this) // so that we're not binding over a proxy
            return op.bind(protect(_this, false, {setOnly}))(...params)
        }
    }
    return _ops
}
