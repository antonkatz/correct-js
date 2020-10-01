export function rename(key) {
    if (key.startsWith("$")) {
        return key.slice(1)
    } else {
        return key
    }
}
