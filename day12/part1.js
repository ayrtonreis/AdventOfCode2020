const fs = require('fs');

const stringToInput = str => str
    .trim()
    .split('\n')
    .map(line => {
        const l = line.trim()
        return [l[0], parseFloat(l.slice(1))]
    });

const testInput = stringToInput(`
F10
N3
F7
R90
F11
`)

const input = stringToInput(fs.readFileSync('./input.txt', 'utf8'))

const sin = a => Math.sin(a * Math.PI / 180)
const cos = a => Math.cos(a * Math.PI / 180)

const stepMap = new Map([
    ['N', ({x, y, angle, amount}) => ({x, y: y + amount, angle})],
    ['S', ({x, y, angle, amount}) => ({x, y: y - amount, angle})],
    ['E', ({x, y, angle, amount}) => ({x: x + amount, y, angle})],
    ['W', ({x, y, angle, amount}) => ({x: x - amount, y, angle})],
    ['L', ({x, y, angle, amount}) => ({x, y, angle: angle + amount})],
    ['R', ({x, y, angle, amount}) => ({x, y, angle: angle - amount})],
    ['F', ({x, y, angle, amount}) => ({x: x + amount * cos(angle), y: y + amount * sin(angle), angle})],
])

function stepAll(commands) {
    let [x, y, angle] = [0, 0, 0]

    commands.forEach(([code, amount]) => {
        ({x, y, angle} = stepMap.get(code)({x, y, angle, amount}))
    })

    return {x, y, angle}
}

function calcDistance(x, y) {
    return Math.abs(x) + Math.abs(y)
}

const arr = input
const {x, y, angle} = stepAll(arr)
const result = calcDistance(x, y)

console.log({result})


console.log('end')

