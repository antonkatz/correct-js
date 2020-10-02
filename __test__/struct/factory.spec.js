import buildFactory from "../../src/struct/buildFactory"

describe("Factory", () => {
    const F1 = buildFactory({value: 1}, {})
    const F2 = buildFactory({prime: true}, {reset() {this.prime = false}})
    const mixedF = F1.mixin(F2)


    test("should produce a valid struct", () => {
        const s = F1()
        expect(s.value).toBe(1)
        expect(() => s.prime).toThrow()
    })

    test("should be mixable", () => {
        const s = mixedF()
        expect(s.prime).toBeTruthy()
        expect(s.value).toBe(1)
        expect(do {
            s.reset()
            s.prime
        }).toBeFalsy()
    })

    // test("should be able to check if a struct is its child", () => {
    //     expect(F.is(TestStruct)).toBeFalsy()
    //
    //     const s = F()
    //     expect(F.is(s)).toBeTruthy()
    // })
})
