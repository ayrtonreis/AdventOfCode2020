const fs = require('fs');

const testInput1 = `
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

const testInput2 = `
28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3
`
    .trim()
    .split('\n')
    .map(num => parseInt(num));

const input = fs
    .readFileSync('./input.txt', 'utf8')
    .trim()
    .split('\n')
    .map(num => parseInt(num));

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

function getSteps(arr){
    const sorted = [...arr].sort((a, b) => a - b)
    sorted.push(sorted[sorted.length -1] + 3)

    const steps = sorted.map((val, i, array) => {
        let j = i + 1
        let steps = 0

        while(array[j] - val <= 3) {
            steps++
            j++
        }
        return steps
    })

    const zipped = zip(sorted, steps)

    return steps.slice(0, steps.length - 1)
}

function getPossibleCombinations(ref, arr){
    let n = 0
    const partials = Array(arr.length).fill(1)

    for(let i = arr.length - 2; i >= 0; i--){
        partials[i] = 0

        for(let j = 1; j <= arr[i]; j++){
            partials[i] = partials[i] + partials[i+j]
        }
    }

    const sorted = [...ref].sort((a, b) => a - b)
    sorted.push(sorted[sorted.length -1] + 3)

    const zipped = zip(sorted, partials)

    return partials
}

const arr = [0, ...input]

const steps = getSteps(arr)
const partials = getPossibleCombinations(arr, steps)
const result = partials[0]

console.log({ result })
console.log('end');
