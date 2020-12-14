const fs = require('fs');

const stringToInput = str => {
    const [earliest, ids] = str.trim().split('\n')

    return {
        earliest: parseInt(earliest),
        ids: ids.trim().split(',').filter(item => item !== 'x').map(item => parseInt(item))
    }
}

const testInput = stringToInput(`
939
7,13,x,x,59,x,31,19
`)

const input = stringToInput(fs.readFileSync('./input.txt', 'utf8'))

function findDelay(target, factor) {
    const remainder = target % factor
    return remainder ? factor - remainder : 0
}

function findGlobalClosestGreater(target, arr) {
    let id = 0
    let minDelay = Infinity

    arr.forEach((currId) => {
        const currDelay = findDelay(target, currId)

        if (currDelay < minDelay) {
            id = currId
            minDelay = currDelay
        }
    })

    return {
        id,
        minDelay,
    }
}

const {earliest, ids} = input
const {id, minDelay} = findGlobalClosestGreater(earliest, ids)
console.log({result: id * minDelay})

console.log('end')

