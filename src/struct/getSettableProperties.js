export default function (struct) {
    return Object.keys(struct).filter(k => !k.startsWith("__"))
}
