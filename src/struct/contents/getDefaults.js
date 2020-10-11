const isFunction = require("@stdlib/assert/is-function")

export default function (defaultContents) {
    if (isFunction(defaultContents)) {
        return defaultContents({})
    } else {
        return defaultContents
    }
}
