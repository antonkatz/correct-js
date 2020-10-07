module.exports = function doSkip(state) {
    // fixme roll into the check below
    let skip = state.file.opts.filename.includes('/correct-js/src/function') ||
        // fixme. Logger gets into an infinite loop with Contents
        state.file.opts.filename.includes('/correct-js/src/struct/buildStruct') ||
        state.file.opts.filename.includes('/correct-js/src/struct/contents') ||
        state.file.opts.filename.includes('/correct-js/src/struct/protect')

    let ignore = state.opts.ignore
    if (!skip && ignore) {
        if (!Array.isArray(ignore)) ignore = [ignore]

        for (const pattern of ignore) {
            if (state.file.opts.filename.match(pattern)) return true
        }
    } else {
        return true
    }

    return false
}
