import buildStruct from "../../src/struct/buildStruct"

export default buildStruct(
    {value: 0},
    {
        // make sure to define functions in this style, and not as arrow functions
        // babel transforms this to `void 0` in arrow functions
        incr() {
            this.value += 1
        }
    }
)
