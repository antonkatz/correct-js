import isKeyToBeInitialized from "./contents/isKeyToBeInitialized"

export default function (contents, defaultContent = null) {
    if (!contents) throw new TypeError("Contents must be defined")
    let missingKeys
    if (defaultContent) {
        missingKeys = new Set(
            Object.entries(defaultContent)
                .filter(([k, v]) => v == null && !isKeyToBeInitialized(k))
                .map(([k]) => k)
        )
    }

    for (const [k, v] of Object.entries(contents)) {
        if (k === "$" || k === "_" || k === "__") throw new SyntaxError(`Key name cannot be only '$' or '_' or '__'`)
        if (defaultContent) {
            if (!(k in defaultContent)) throw new TypeError(`Extra key in struct's content:${k}`)
            if (v != null || defaultContent[k] != null) missingKeys.delete(k)
        } else {
            if (v == null) throw new TypeError(`Struct's contents must have only defined values, since it has no defaults. Error on key $${k}`)
        }
    }

    if (missingKeys && missingKeys.size > 0) {
        throw new TypeError(`Struct is missing content keys: ${Array.from(missingKeys)}`)
    }
}
