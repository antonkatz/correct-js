export default function (givenContents) {
    const keys = Object.keys(givenContents)
    return function () {
        return keys.map(k => [k, this[k]]) |>
            Object.fromEntries
    }
}
