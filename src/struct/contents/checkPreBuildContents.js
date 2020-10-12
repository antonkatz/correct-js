export default function (contents) {
    for (const k of Object.keys(contents)) {
        if (k.startsWith("$")) throw new TypeError(`Key "${k}" is defined at instantiation, thus it cannot be passed in as an arg (to struct constructor)`)
    }
}
