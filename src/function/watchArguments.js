import newTrackingInfo from "./newTrackingInfo"
import throwError      from "./throwError"

const tracker = new Map()

export default function (fnName, filePath, lineNumber, hasRestElem, expectedArgs, givenArgs) {
    const fnId = `${filePath}:${lineNumber}`

    if (givenArgs.length < expectedArgs.length &&
        expectedArgs.slice(givenArgs.length).findIndex(e => e === undefined) >= 0) {
        throwError(`Less arguments given than expected ${fnId}`)
    } else if (givenArgs.length > expectedArgs.length) {
        let isTooMany;
        if (expectedArgs.length === 0) {
            isTooMany = true
        } else {
            if (hasRestElem) {
                const last = expectedArgs[expectedArgs.length - 1]
                // in case of a spread operator
                if (!Array.isArray(last)) {
                    isTooMany = true
                } else {
                    isTooMany = (expectedArgs.length - 1 + last.length) !== givenArgs.length
                }
            } else {
                isTooMany = true
            }
        }
        if (isTooMany) throwError(`More arguments given than expected ${fnId}`)
    }

    let trackingInfo;

    if (tracker.has(fnId)) {
        console.log("+")
        trackingInfo = tracker.get(fnId)
        const changeInLength = trackingInfo.compareLength(expectedArgs)
        if (changeInLength !== 0) {
            throwError(`Number of arguments has changed (by ${changeInLength}) at ${fnId}`)
        }
    } else {
        console.log('&')
        trackingInfo = newTrackingInfo()
        tracker.set(fnId, trackingInfo)
    }

    trackingInfo.updateWithArgs(expectedArgs)
}
