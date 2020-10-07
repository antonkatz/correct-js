import isKeyToBeInitialized from "./contents/isKeyToBeInitialized"

export default function (struct, defaultContents) {
    const kv = Object.entries(struct)
    const defaults = defaultContents ?? {}
    for (const [k,v] of kv) {
        if (v === undefined) throw new TypeError(`Struct is not properly instantiated, missing content value under key: ${k}`)
        if (isKeyToBeInitialized(k) && defaults[k] === v) throw new ReferenceError(`Key '$${k}' in struct must be initialized to a different value than default`)
    }
}
