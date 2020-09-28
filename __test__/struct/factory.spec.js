import buildFactory from "../../src/struct/buildFactory"
import TestStruct   from "./TestStruct"

describe("Factory", () => {
    const F = buildFactory({value: 1}, {})

    test("should produce a valid struct", () => {
        const s = F()
        expect(s.value).toBe(1)
    })

    test("should be able to check if a struct is its child", () => {
        expect(F.is(TestStruct)).toBeFalsy()

        const s = F()
        expect(F.is(s)).toBeTruthy()
    })
})
