import {rename} from "./renameKey"

export default function (givenContents) {
    const keys = Object.keys(givenContents)
    return function () {
        // renaming keys that are marked to be filled at instantiation
        // and hiding keys prepended with _
        return keys
            .map(k => {
                const name = rename(k)
                if (!name.startsWith("_")) {
                    return [name, this[k]]
                }
            }).filter(kv => !!kv) |>
            Object.fromEntries
    }
}

