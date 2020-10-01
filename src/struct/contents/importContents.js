import {rename} from "./renameKey"

export default function (givenContents, defaultContents) {
    const searchKeys = Object.keys(defaultContents)
        .map(k => [rename(k), k]) |> Object.fromEntries

    const remapped = {}
    for (const [_k,v] of Object.entries(givenContents)) {
        const k = searchKeys[_k] ?? _k
        remapped[k] = v
    }

    return remapped
}
