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

function findFirstError(arr) {
    const preambleLength = 25

    for(let i = preambleLength; i < arr.length; i++){
        if(!checkRule(arr, i, preambleLength))
            return arr[i]
    }
    return null
}

const firstError = findFirstError(input)

console.log({firstError})

console.log('end');
