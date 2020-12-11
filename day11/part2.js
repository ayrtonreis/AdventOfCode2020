const fs = require('fs');

const stringToMatrix = str => str
    .trim()
    .split('\n')
    .map(line => line.trim().split(''));

const testInput = stringToMatrix(`
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL
`)

const input = stringToMatrix(fs.readFileSync('./input.txt', 'utf8'))


function stepRules(matrix) {
    const rowsLength = matrix.length
    const colsLength = matrix[0].length

    const result = new Array(rowsLength).fill(null).map(() => new Array(colsLength).fill(null))

    const countOccupied = (centerRow, centerCol) => {
        const rows = [centerRow - 1, centerRow, centerRow + 1]
        const cols = [centerCol - 1, centerCol, centerCol + 1]
        let count = 0

        rows.forEach(r => {
            cols.forEach(c => {
                if (r === centerRow && c === centerCol) return

                const row = matrix[r]
                const value = row && row[c]
                const isOccupied = value === '#'
                if (isOccupied) {
                    count++
                }
            })
        })

        return count
    }

    const getValue = (r, c) => {
        const current = matrix[r][c]
        const occupied = countOccupied(r, c)

        if (current === 'L' && occupied === 0) return '#'
        if (current === '#' && occupied >= 4) return 'L'
        return current
    }

    for (let r = 0; r < rowsLength; r++) {
        for (let c = 0; c < colsLength; c++) {
            result[r][c] = getValue(r, c)
        }
    }

    return result
}

function countOccupied(matrix, centerRow, centerCol){
    const isWithinBoundary = (r, c) => r >= 0 && r < matrix.length && c >= 0 && c < matrix[0].length

    const steps = {
        top:            (r, c) => [r-1,   c],
        topRight:       (r, c) => [r-1,   c+1],
        right:          (r, c) => [r,     c+1],
        bottomRight:    (r, c) => [r+1,   c+1],
        bottom:         (r, c) => [r+1,   c],
        bottomLeft:     (r, c) => [r+1,   c-1],
        left:           (r, c) => [r,     c-1],
        topLeft:        (r, c) => [r-1,   c-1],
    }

    let count = 0

    Object.values(steps).forEach(step => {
        let [r, c] = [centerRow, centerCol]

        while (true) {
            ([r, c] = step(r, c))

            if(!isWithinBoundary(r, c)) return

            const element = matrix[r][c]

            if (element === 'L') return
            if (element === '#') {
                count++
                return
            }
        }
    })

    return count
}

function stepRules(matrix) {
    const rowsLength = matrix.length
    const colsLength = matrix[0].length

    const result = new Array(rowsLength).fill(null).map(() => new Array(colsLength).fill(null))

    const getValue = (r, c) => {
        const current = matrix[r][c]
        const occupied = countOccupied(matrix, r, c)

        if (current === 'L' && occupied === 0) return '#'
        if (current === '#' && occupied >= 5) return 'L'
        return current
    }

    for (let r = 0; r < rowsLength; r++) {
        for (let c = 0; c < colsLength; c++) {
            result[r][c] = getValue(r, c)
        }
    }

    return result
}

function findStableMatrix(matrix) {
    let current = stepRules(matrix)
    let prev = null

    while (JSON.stringify(current) !== JSON.stringify(prev)) {
        ;([prev, current] = [current, stepRules(current)])
    }

    return current
}

function countTotalOccupied(matrix) {
    let count = 0

    matrix.forEach(row => row.forEach(element => {
        if (element === '#') count++
    }))

    return count
}

// const r0 = stepRules(testInput)
// console.table(r0)
//
// const r1 = stepRules(r0)
// console.table(r1)


const finalMatrix = findStableMatrix(input)
const result = countTotalOccupied(finalMatrix)

console.table(finalMatrix)
console.log({result})


// const arr = stringToMatrix(`
// .............
// .L.L.#.#.#.#.
// .............
// `)

// console.table(arr)
//
// console.log({occupied: countOccupied(arr, 1, 1)})

console.log('end')

