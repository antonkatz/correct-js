export default function (msg) {
    if (process?.env?.CORRECT_JS_STRICT === 'false') {
        console.warn(msg)
    } else {
        throw new SyntaxError(msg)
    }
}
