const fs = require('fs');

// const testInput = `
// 35
// 20
// 15
// 25
// 47
// 40
// 62
// 55
// 65
// 95
// 102
// 117
// 150
// 182
// 127
// 219
// 299
// 277
// 309
// 576
// `
//     .trim()
//     .split('\n')
//     .map(num => parseInt(num));

const input = fs
  .readFileSync('./input.txt', 'utf8')
  .trim()
  .split('\n')
  .map(num => parseInt(num));



function checkRule(arr, pos, checkLength){
    for(let i = pos - checkLength; i < pos; i++){
        for(let j = pos - checkLength; j < pos; j++){
            if(i !== j && (arr[i] + arr[j] === arr[pos])) {
                return true
            }
        }
    }

    return false
}

function findFirstError(arr, preambleLength) {
    for(let i = preambleLength; i < arr.length; i++){
        if(!checkRule(arr, i, preambleLength))
            return arr[i]
    }
    return null
}

function findContiguousList(arr, target) {
    for(let start = 0; start < arr.length; start++){
        let sum = 0
        for(let end = start; end < arr.length; end++ ){
            sum += arr[end]

            if(sum === target)
                return {start, end}
        }
    }
}

function getMaxMinSum(arr, start, end){
    let [min, max] = [Infinity, -Infinity]

    for(let i = start; i <= end; i++){
        min = Math.min(min, arr[i])
        max = Math.max(max, arr[i])
    }

    return min + max

}

const firstError = findFirstError(input, 25)
const {start, end } = findContiguousList(input, firstError)
const weakness = getMaxMinSum(input, start, end)

console.log({firstError})
console.log({start, end})
console.log(weakness)

console.log('end');
