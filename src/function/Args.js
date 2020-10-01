export default function (_babel) {
    const Args = Object.create({
        definedSize() {
            return this.args.values().filter(v !== undefined).length
        },
        count() {
            _babel.length
        }
    }) |>
        Object.assign(?, Object.fromEntries(_babel))

    return Args
}
