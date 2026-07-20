function curriedJoin(fn) {

    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args)
        }
        else {
            return function (...more_args) {
                return curried(...args, ...more_args)
            }
        }
    }
}

// ---- TEST (added, does not modify code above) ----
// curriedJoin here is the curry() factory: it takes a function, returns a curried one.
const curry = curriedJoin
function test() {
    const join = (a, b, c) => `${a}_${b}_${c}`
    const cJoin = curry(join)
    const cases = [
        { name: 'fully curried (1)(2)(3)', run: () => cJoin(1)(2)(3), expected: '1_2_3' },
        { name: 'all at once (1,2,3)', run: () => cJoin(1, 2, 3), expected: '1_2_3' },
        { name: 'partial (1)(2,3)', run: () => cJoin(1)(2, 3), expected: '1_2_3' },
        { name: 'partial (1,2)(3)', run: () => cJoin(1, 2)(3), expected: '1_2_3' },
    ]

    let pass = 0
    for (const c of cases) {
        let got
        try { got = c.run() } catch (e) { got = `ERROR: ${e.message}` }
        const ok = got === c.expected
        if (ok) pass++
        console.log(`${ok ? 'PASS' : 'FAIL'} | ${c.name} => got ${JSON.stringify(got)}, expected ${JSON.stringify(c.expected)}`)
    }
    console.log(`\n${pass}/${cases.length} passed`)
}

test()