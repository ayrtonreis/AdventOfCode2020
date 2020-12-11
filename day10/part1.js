const fs = require('fs');

const testInput = `
16
10
15
5
1
11
7
19
6
12
4
`
    .trim()
    .split('\n')
    .map(num => parseInt(num));

const input = fs
  .readFileSync('./input.txt', 'utf8')
  .trim()
  .split('\n')
  .map(num => parseInt(num));


function getDifferences(arr){
    const sorted = [...arr].sort((a, b) => a - b)
    sorted.push(sorted[sorted.length -1] + 3)

    const differences = new Array(sorted.length - 1)

    differences[0] = sorted[0]

    for(let i = 1; i < sorted.length; i++){
        differences[i] = sorted[i] - sorted[i-1]
    }

    return differences
}

/**
 *
 * @param {number[]} arr
 * @returns {Map<number, number>}
 */
function countDifferences(arr){
    const map = new Map()

    arr.forEach((val) => {
        if(map.has(val)){
            const prev = map.get(val)
            map.set(val, prev + 1)
        } else {
            map.set(val, 1)
        }
    })

    return map
}

const arr = testInput

const differences = getDifferences(arr)
const countMap = countDifferences(differences)
const mult = countMap.get(1) * countMap.get(3)

console.log({1: countMap.get(1), 3: countMap.get(3)})
console.log({ mult })

console.log('end');
