export default function (defaultContents) {
    for (const [k,v] of Object.entries(defaultContents)) {
        if (v == null) throw new TypeError(`Struct's contents must have default values. Error on key $${k}`)
    }
}
