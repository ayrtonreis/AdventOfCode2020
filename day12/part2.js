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

// const sin = a => Math.sin(a * Math.PI / 180)
// const cos = a => Math.cos(a * Math.PI / 180)

const toRadians = a => a * Math.PI / 180
const toPolarCord = (x, y) => ({l: Math.sqrt(x * x + y * y), a: Math.atan2(y, x)})
const toCartesian = (l, a) => ({x: l * Math.cos(a), y: l * Math.sin(a)})

const rotate = (x, y, angle) => {
    const deltaAngle = toRadians(angle)

    const {l, a} = toPolarCord(x, y)
    const {x: targetX, y: targetY} = toCartesian(l, a + deltaAngle)
    return {x: targetX, y: targetY}
}

const stepMap = new Map([
    ['N', ({x, y, amount}) => ({x, y: y + amount})],
    ['S', ({x, y, amount}) => ({x, y: y - amount})],
    ['E', ({x, y, amount}) => ({x: x + amount, y})],
    ['W', ({x, y, amount}) => ({x: x - amount, y})],
    ['L', ({x, y, amount}) => rotate(x, y, amount)],
    ['R', ({x, y, amount}) => rotate(x, y, -amount)],
])

function stepAll(commands) {
    const ship = {x: 0, y: 0}
    const wayPoint = {x: 10, y: 1}

    const moveShipForward = ({curr, ref, amount}) => ({x: curr.x + amount * ref.x, y: curr.y + amount * ref.y})

    commands.forEach(([code, amount]) => {
        if(code === 'F'){
            const {x, y} = moveShipForward({curr: ship, ref: wayPoint, amount})
            ship.x = x
            ship.y = y
            return
        }

        const {x, y} = stepMap.get(code)({x: wayPoint.x, y: wayPoint.y, amount})
        wayPoint.x = x
        wayPoint.y = y
    })

    return {x: ship.x, y: ship.y}
}

function calcDistance(x, y) {
    return Math.abs(x) + Math.abs(y)
}

const arr = input
const {x, y} = stepAll(arr)
const result = calcDistance(x, y)

console.log({result})


console.log('end')

