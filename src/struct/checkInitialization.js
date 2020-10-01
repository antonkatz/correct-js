export default function (struct) {
    const kv = Object.entries(struct)
    for (const [k,v] of kv) {
        if (v === undefined) throw new TypeError(`Struct is not properly instantiated, missing content value under key: ${k}`)
    }
}
