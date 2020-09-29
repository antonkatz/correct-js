import promiselike from "../../src/mixins/promiselike"

describe("Promiselike mixin", () => {
    test("should be resolvable", async () => {
        const s = promiselike()
        await s
    })
})
