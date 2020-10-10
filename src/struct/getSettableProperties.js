export default function (struct) {
    // only gets own keys anyways. functions are in prototype
    return Object.keys(struct).filter(k => !k.startsWith("__"))
}
