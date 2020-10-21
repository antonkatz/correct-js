import getDefaults from "./getDefaults"

export function combineDefaultContents_slack(thisDefaults, otherDefaults) {
    const _tD = getDefaults(thisDefaults)
    const _oD = getDefaults(otherDefaults)

    return Object.keys(_tD)
        .concat(Object.keys(_oD))
        |> (ks => new Set(ks))
        |> Array.from
        |> (ks => ks.map(k => {
        const v = _oD[k] === undefined ? _tD[k] : _oD[k]

        if (_oD[k] !== undefined && _tD[k] !== undefined) {
            throw new Error("Cannot overwrite default values of a lower layer")
        }
        return [k, v]
    }))
        |> Object.fromEntries
}

export function combineDefaultContents_strict(thisDefaults, otherDefaults) {
    const _tD = getDefaults(thisDefaults)
    const _oD = getDefaults(otherDefaults)

    const oKeys = Object.keys(_oD)
    Object.keys(_tD).forEach(_tk => {
        if (oKeys.includes(_tk)) throw new Error("Layers cannot share variables of the same name: " + _tk)
    })
    return {..._tD, ..._oD}
}
