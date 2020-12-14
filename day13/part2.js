const fs = require('fs');

const stringToInput = str => {
    const [_, ids] = str.trim().split('\n')

    return ids
        .trim()
        .split(',')
        .map((id, index) => id !== 'x' ? [parseInt(id), index] : null)
        .filter(el => el !== null)
}

const testInput = stringToInput(`
939
1789,37,47,1889
`)

const input = stringToInput(fs.readFileSync('./input.txt', 'utf8'))


function writeEquation(arr) {
    const partials = arr.map(([id, offset]) => `(t + ${offset})%${id} = 0`)
    return partials.join(' and ')
}

function lcm(a, b) {
    const gdc = (a, b) => {
        // a must be greater or equals than b
        if (b > a) [a, b] = [b, a]
        if (b === 0) return a

        return gdc(b, a % b)
    }

    return (a * b) / gdc(a, b)
}

function findNext(initial, step, validator) {
    let num = initial

    while (!validator(num)) {
        num += step
    }

    return num

    // not needed because all numbers are primes
    // return lcm(initial, num)
}

function findSolution(arr) {
    let current = 1
    let step = 1

    arr.forEach(([id, offset]) => {
        const validator = n => (n + offset) % id === 0

        const next = findNext(current, step, validator)
        current = next
        step *= id
    })

    return current
}

const arr = input
const result = findSolution(arr)
console.log({result})

console.log('end')