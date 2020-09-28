function testFn(arg1, arg2) {
    console.log('testFn', [arg1, arg2])
}

function testFnWithDefaults(arg1, arg2, arg3 = 3) {
    console.log('Default arg', arg3)
}

function testFnWithRest(arg1, ...rest) {}

describe("Tracking number of arguments", () => {
    test("is correct when calling consistently", () => {
        testFn(1,2)
        testFn(1,2)
    })

    test("fails if the number of arguments increases", () => {
        testFn(1, 2)
        expect(() => {
            testFn(1, 2, 3)
        }).toThrow()
    })

    test("fails if the number of arguments decreases", () => {
        testFn(1, 2)
        expect(() => {
            testFn(1)
        }).toThrow()
    })

    test("function with defaults", () => {
        testFnWithDefaults(1,2)
        testFnWithDefaults(1,2,4)
    })

    test("function with rest parameters", () => {
        testFnWithRest(1, 3, 4, 5)
        testFnWithRest(1, 3, 4, 5, 6)
    })

    test("function with an array in rest parameters", () => {
        testFnWithRest(1, [3, 4, 5])
    })

    test("function with an array as last argument", () => {
        expect(() => testFn(1, [2,3], 4)).toThrow()
        expect(() => testFn(1, [2,3], [4, 5])).toThrow()
    })
})
