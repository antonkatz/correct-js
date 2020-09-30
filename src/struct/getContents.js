export default function (givenContents) {
    const keys = Object.keys(givenContents)
    return () => {
        return keys.map(k => [k, this[k]]) |>
            Object.fromEntries
    }
}
