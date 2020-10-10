import {buildFactory} from "../../src"

describe("Mixed factories", () => {
    test("should be instantiatable", () => {
        const F = buildFactory({a: 1}, {inc() {this.a += 1}}, function () {this.inc()})
            .mix({b: 5}, {decr() {this.b -= 1}}, function () {this.decr()})

        const S = F()
        expect(S.a).toBe(2)
        expect(S.b).toBe(4)
        expect(S.$).toBeTruthy() // todo. for now, should be hidden later
    })

    test("methods should be layerable", () => {
        const F = buildFactory({a: 1}, {inc() {this.a += 1}})
            .mix({b: 5}, {inc() {this.b += 1; this.$.inc()}})

        const S = F()
        expect(S.a).toBe(1)
        expect(S.b).toBe(5)
        S.inc()
        expect(S.a).toBe(2)
        expect(S.b).toBe(6)
    })

    test("methods and props should fall through to the lowest layer from the outsite", () => {
        const F = buildFactory({a: 1, c: undefined}, {set() {this.c = "c"}})
            .mix({b: 5, e: undefined}, {decr() {this.b += 1; this.$.inc()}})

        const S = F({c: "e", e: "e"})
        expect(S.c).toBe("e")
        expect(S.e).toBe("e")
        S.set()
        expect(S.c).toBe("c")
    })

    test("methods and props should fall through to the lowest layer from the outsite", () => {
        const F = buildFactory({a: 1, c: undefined}, {set() {this.c = "c"}})
            .mix({b: 5, e: undefined}, {decr() {this.b += 1; this.$.inc()}})

        expect(() => F({e: "e"})).toThrow()
        expect(() => F({c: "e"})).toThrow()
        expect(() => F({c: "e", e: "e"})).not.toThrow()
        expect(() => F({c: "e", e: "e", f: "f"})).toThrow()
    })
})
