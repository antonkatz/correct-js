import TestStruct  from "./TestStruct"

describe("Access patterns on a struct", () => {
    test("Value should be a number", () => {
        expect(typeof TestStruct.value).toBe("number")
    })

    test("All `set` operations should fail", () => {
        expect(() => TestStruct.value = 4).toThrow()
    })
})
