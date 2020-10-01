export default function () {
    return {
        lastArgs: null,

        updateArgs(args) {
            this.lastArgs = args
        },

        compareSize(args) {
            return args.definedSize() - this.lastArgs.definedSize()
        }
    }
}
