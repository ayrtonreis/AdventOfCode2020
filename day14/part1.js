const fs = require('fs');

const stringToInput = str => str.trim().split('\n').map(line => line.split(' = '))

const testInput = stringToInput(`
mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0
`)

const input = stringToInput(fs.readFileSync('./input.txt', 'utf8'))

// function applyMask(mask, input) {
//     let mask1 = 0 // 0 by default, 1 if position is 1
//     let mask2 = 0 // 1 by default, 0 if position is 0
//
//     const maskArr = mask.split('')
//
//     maskArr.forEach((c, index) => {
//         mask1 = mask1 << 1
//         mask2 = mask2 << 1
//
//         mask1 += c === '1' ? 1 : 0
//         mask2 += c === '0' ? 0 : 1
//     })
//
//     const result = (input | mask1) & mask2
//     return result
// }

/**
 *
 * @param {string} mask
 * @param {number} input
 * @returns {number}
 */
function applyMask(mask, input) {
    let mask1 = mask.replace(/[^1]/g, '0') // 0 by default, 1 if position is 1
    let mask2 = mask.replace(/[^0]/g, '1') // 1 by default, 0 if position is 0

    mask1 = BigInt(parseInt(mask1, 2))
    mask2 = BigInt(parseInt(mask2, 2))

    let result = (BigInt(input) | mask1) & mask2

    return Number(result)
}

function applySequentialMasks(arr) {
    const cache = {}
    let currentMask = null

    arr.forEach(([opCode, arg]) => {
        if (opCode === 'mask') {
            currentMask = arg
            return
        }

        const address = parseInt(opCode.match(/\d+/)[0])

        const num = parseInt(arg)
        const maskedValue = applyMask(currentMask, num)
        cache[address] = maskedValue
    })

    return cache
}

const arr = input
const memorySpace = applySequentialMasks(arr)
const sum = Object.values(memorySpace).reduce((acc, val) => acc + val, 0)

console.log({sum})

console.log('end')

