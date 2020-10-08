export function strictPropertyGet(target, name, receiver, errorMsg = 'Struct has no such property: ') {
    if (!(name in target)) {
        let msg = errorMsg
        try {
            msg += name.toString()
        } catch (e) {
            console.warn("Could not provide key because", e)
        }
        const error = new TypeError(msg)

        const relevantTrace = error.stack.split('\n').slice(2)

        if (name !== "then") { // promiselike checking is so pervasive, that this needs to be skipped entirely
            // if the stack trace is absent, and the function is called from external lib -- skip
            let skip = relevantTrace.length === 0
            for (const line of relevantTrace) {
                if (line.includes('/')) {
                    // checking that the first line is external
                    skip = line.includes('/node_modules/') || line.includes("internal/process")
                    break
                }
            }
            if (skip) {
                console.info(msg, error.stack)
            } else {
                console.error(msg)
                throw error
            }
        }
    }
    return target[name]
}
