export default function (other) {
    if (!Array.isArray(other.__isTypeOf)) throw new TypeError("Can only mix a struct or struct factory")

    this.__isTypeOf = [...this.__isTypeOf, ...other.__isTypeOf]

    // todo. check that there aren't overlapping values
    this.__defaultContents = [...this.__defaultContents, ...other.__defaultContents]
    this.__operators = [...this.__operators, ...other.__operators]

}
