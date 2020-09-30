export default function (defaultContents) {
    for (const [k,v] of Object.entries(defaultContents)) {
        if (v === null) throw new TypeError(`Struct's contents must have non-null values. Error on key $${k}`)
    }
    // fixme flag extra values
    // fixme flag values that must be given on creation
}
