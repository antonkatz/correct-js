import buildFactory from "../../src/struct/buildFactory"

describe("Factory", () => {
    const F1 = buildFactory({value: 1}, {})
    const F2 = buildFactory({prime: true}, {reset() {this.prime = false}})
    const mixedF = F1.mixWith(F2)


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

    test("should guard against extra values", () => {
        expect(() => mixedF({nonExistent: 1})).toThrow("Extra key")
    })

    test("could have a function as default parameters", () => {
        const F3 = buildFactory(({c}) => ({a: [], b: new Map(), c}), {})

        const s = F3({c: "c"})
        expect(s.a).toHaveLength(0)
        expect(() => s.b.set("key",2)).not.toThrow()
        expect(s.b.get("key")).toBe(2)
        expect(s.c).toBe("c")
    })

    // test("should be able to check if a struct is its child", () => {
    //     expect(F.is(TestStruct)).toBeFalsy()
    //
    //     const s = F()
    //     expect(F.is(s)).toBeTruthy()
    // })
})
