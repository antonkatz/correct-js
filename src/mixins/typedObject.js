import buildFactory from "../struct/buildFactory"

// how about writing a declaration string eg "type,allowed_types:"

export default buildFactory({
    type: "",
    _ALLOWED_TYPES: []
}, {
    is(type) {
        if (!this._ALLOWED_TYPES.includes(type)) throw new ReferenceError("Cannot be of type " + this.type)
        return this.type === type
    },
    setAllowed(types) {
        this._ALLOWED_TYPES = types
        if (!this._ALLOWED_TYPES.includes(this.type)) throw new ReferenceError("Cannot be of type " + this.type)
    }
}, function () {
    if (this._ALLOWED_TYPES.length > 0 &&
        !this._ALLOWED_TYPES.includes(this.type)) throw new ReferenceError("Cannot be of type " + this.type)
})
