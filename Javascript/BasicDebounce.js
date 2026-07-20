function basicDebounce(fn, delay) {

    let timerId
    return function (...args) {
        clearTimeout(timerId)
        timerId = setTimeout(() => {
            fn(...args)
        }, delay)
    }


}

// ---- TEST (added, does not modify code above) ----
// Fake virtual clock so currentTime advances like the real grader.
let currentTime = 0
let timers = []
let idCounter = 1

const fakeSetTimeout = (cb, delay) => {
    const id = idCounter++
    timers.push({ id, time: currentTime + Number(delay), cb })
    return id
}
const fakeClearTimeout = (id) => {
    timers = timers.filter((t) => t.id !== id)
}
const runAllTimers = () => {
    while (timers.length) {
        timers.sort((a, b) => a.time - b.time)
        const next = timers.shift()
        currentTime = next.time
        next.cb()
    }
}

const run = (input) => {
    // swap in the fake clock (basicDebounce reads global setTimeout at call time)
    const realST = global.setTimeout
    const realCT = global.clearTimeout
    global.setTimeout = fakeSetTimeout
    global.clearTimeout = fakeClearTimeout

    currentTime = 0
    timers = []
    const calls = []
    const func = (arg) => {
        calls.push(`${arg}@${currentTime}`)
    }
    const debounced = basicDebounce(func, 3)
    input.forEach((call) => {
        const [arg, time] = call.split('@')
        setTimeout(() => debounced(arg), time)
    })
    runAllTimers()

    global.setTimeout = realST
    global.clearTimeout = realCT
    return calls
}

function test() {
    const cases = [
        { input: ['A@0', 'B@2', 'C@3'], expected: ['C@5'] }, // <- your "C@5" expectation
    ]
    for (const c of cases) {
        const got = run(c.input)
        const ok = JSON.stringify(got) === JSON.stringify(c.expected)
        console.log(
            `${ok ? 'PASS' : 'FAIL'} | run(${JSON.stringify(c.input)}) => got ${JSON.stringify(got)}, expected ${JSON.stringify(c.expected)}`
        )
    }
}

test()