import TestStruct from "./TestStruct"

describe("Operations", () => {
    test("should have desired effect", () => {
        expect(TestStruct.value).toBe(
            (TestStruct.incr(), TestStruct.value - 1)
        )
    })
})
