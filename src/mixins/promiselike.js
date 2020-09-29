import buildStruct  from "../struct/buildStruct"
import buildFactory from "../struct/buildFactory"
import noop       from "@stdlib/utils/noop"

export default buildFactory({
    thenTransformer: noop,
    _executionError: false
}, {
    then(resolve, reject) {
        try {
            resolve(this.thenTransformer(this))
        } catch (err) {
            this._executionError = err
            reject(err)
        }
        return this
    },
    catch(op) {
        op(this._executionError)
        return this
    }
})
