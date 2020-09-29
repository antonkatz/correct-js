import buildStruct from "../struct/buildStruct"

export default buildStruct({
    _executionError: false
}, {
    then(op) {
        try {
            op(this)
        } catch (err) {
            this._executionError = err
        }
        return this
    },
    catch(op) {
        op(this._executionError)
        return this
    }
})
