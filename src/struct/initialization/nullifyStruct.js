import isFunction from "@stdlib/assert/is-function"

export function shouldNullifyStruct(initializerResult) {
    return initializerResult !== undefined && !initializerResult
}

export function shouldNullifyStructPromise(initializerResult) {
        if (!!initializerResult && isFunction(initializerResult.then)) {
            const should = initializerResult.then(shouldNullifyStruct).then(v => !v)
            return {
                then: (fn) => {
                    return should.then((_s) => {
                        if (_s === true) return true
                        return fn()
                    })
                }
            }
        } else {
            const should = shouldNullifyStruct(initializerResult)
            return {
                then: (fn) => {
                    if (should) return true
                    return fn()
                }
            }
        }
}

export function nullify(initializerResult, struct) {
    if (shouldNullifyStruct(initializerResult)) {
        return undefined
    }
    return struct
}
