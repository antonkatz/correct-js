export default function (_babel) {
    const Args = Object.create({
        definedSize() {
            return Array.from(this.args.values()).filter(v => v !== undefined).length
        },
        count() {
            _babel.length
        }
    }) |>
        Object.assign(?, {args: new Map(_babel)})

    return Args
}
