const isFunction = require("@stdlib/assert/is-function")

export default function (contents = {}, defaultContents,) {
    if (isFunction(defaultContents)) {
        return {...defaultContents(contents), ...contents}
    } else {
        return {...defaultContents, ...contents, }
    }
}
