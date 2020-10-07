export function shouldNullifyStruct(initializerResult) {
    return initializerResult !== undefined && !initializerResult
}

export function nullify(initializerResult, struct) {
    if (shouldNullifyStruct(initializerResult)) {
        return undefined
    }
    return struct
}
