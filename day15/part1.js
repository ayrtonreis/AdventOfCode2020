const fs = require('fs');

const stringToInput = str => str.trim().split(',').map(n => parseInt(n))

const input = stringToInput(fs.readFileSync('./input.txt', 'utf8'))

const testInput = stringToInput('0,3,6')


function getNth(arr, n) {
    if (n <= arr.length) return arr[n-1]

    const iterations = n - arr.length
    const positionByItem = new Map(arr.map((item, index) => [item, index+1]))

    let last = arr[arr.length -1]
    for (let i = arr.length + 1; i <= n; i++) {
        if(!positionByItem.has(last)){
            positionByItem.set(last, i - 1)
            last = 0
        } else {
            const prevIndex = positionByItem.get(last)

            const diff = i -prevIndex - 1

            positionByItem.set(last, i -1)
            last = diff
        }
    }

    return last

}

const arr = input

console.time()
const result = getNth(arr, 2020)
// const result = new Array(10).fill(null).map((_, i) => getNth(arr, i+1))
console.timeEnd()

console.log({result})

console.log('end')

