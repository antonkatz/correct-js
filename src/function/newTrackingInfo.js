export default function () {
    return {
        argsLength: -1,
        updateWithArgs(args) {
            this.argsLength = args.length
        },
        compareLength(args) {
            return args.length - this.argsLength
        }
    }
}
