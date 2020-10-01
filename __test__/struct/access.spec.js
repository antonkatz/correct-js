import TestStruct  from "./TestStruct"
import buildStruct from "../../src/struct/buildStruct"

describe("Access patterns on a struct", () => {
    test("Value should be a number", () => {
        expect(typeof TestStruct.value).toBe("number")
    })

    test("All `set` operations should fail", () => {
        expect(() => TestStruct.value = 4).toThrow()
    })

    test("Contents should be accessible", () => {
        const S = buildStruct(
            {value: 0},
            {
                // make sure to define functions in this style, and not as arrow functions
                // babel transforms this to `void 0` in arrow functions
                incr() {
                    this.value += 1
                }
            }
        )

        expect(TestStruct.Contents()).toEqual({value: 0})
    })
})
