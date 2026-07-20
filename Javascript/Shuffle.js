const shuffle = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        let idx = Math.floor(Math.random() * (arr.length - 1 - i + 1)) + i;
        let temp = arr[i]
        arr[i] = arr[idx]
        arr[idx] = temp
    }
}

// ---- TEST (added, does not modify code above) ----
function test() {
    const N = 240000            // runs; 24 perms -> ~10000 each if uniform
    const counts = {}
    let mutatesInPlace = true

    for (let k = 0; k < N; k++) {
        const arr = [1, 2, 3, 4]
        const ref = arr
        shuffle(arr)
        if (ref !== arr) mutatesInPlace = false        // must be same reference
        if (arr.length !== 4) throw new Error('length changed')
        const key = arr.join('')
        counts[key] = (counts[key] || 0) + 1
    }

    const keys = Object.keys(counts)
    const expectedPerms = 24
    const ideal = N / expectedPerms
    const values = keys.map((k) => counts[k])
    const min = Math.min(...values)
    const max = Math.max(...values)
    const maxDeviation = Math.max(Math.abs(min - ideal), Math.abs(max - ideal)) / ideal

    console.log(`in-place (same ref):        ${mutatesInPlace ? 'PASS' : 'FAIL'}`)
    console.log(`distinct permutations seen: ${keys.length} (expected ${expectedPerms}) ${keys.length === expectedPerms ? 'PASS' : 'FAIL'}`)
    console.log(`ideal count per perm:       ${ideal}`)
    console.log(`min / max count:            ${min} / ${max}`)
    console.log(`max deviation from ideal:   ${(maxDeviation * 100).toFixed(2)}% ${maxDeviation < 0.1 ? 'PASS (<10%)' : 'FAIL (>10% = biased)'}`)

    // show the full distribution sorted
    console.log('\ndistribution:')
    keys.sort().forEach((k) => {
        const pct = ((counts[k] / N) * 100).toFixed(2)
        console.log(`  ${k}: ${counts[k]}  (${pct}%)`)
    })
}

test()