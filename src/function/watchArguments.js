import newTrackingInfo from "./newTrackingInfo"
import throwError from "./throwError"
import Logger     from "./logging/Logger"
import Args       from "./Args"

const tracker = new Map()

export default function (fnName, filePath, lineNumber, hasRestElem, expectedArgs, givenArgs) {
    const fnId = `${fnName}:${filePath}:${lineNumber}`

    const args = Args(expectedArgs)
    Logger.logFunctionCall(fnName, filePath, lineNumber, args)

    if (givenArgs.length < args.count() &&
        expectedArgs.slice(givenArgs.length).findIndex(e => e[1] === undefined) >= 0) {
        throwError(`Less arguments given than expected ${fnId}`)
    } else if (givenArgs.length > expectedArgs.length) {
        let isTooMany;
        if (expectedArgs.length === 0) {
            isTooMany = true
        } else {
            if (hasRestElem) {
                const last = expectedArgs[expectedArgs.length - 1][1]
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
        if (isTooMany) {
            throwError(`More arguments given than expected ${fnId}`)
        }
    }

    let trackingInfo;

    if (tracker.has(fnId)) {
        trackingInfo = tracker.get(fnId)
        // fixme this does not actually track a change
        const changeInLength = trackingInfo.compareSize(args)
        if (changeInLength !== 0) {
            throwError(`Number of arguments has changed (by ${changeInLength}) at ${fnId}`)
        }
    } else {
        trackingInfo = newTrackingInfo()
        tracker.set(fnId, trackingInfo)
    }

    trackingInfo.updateArgs(args)
}
