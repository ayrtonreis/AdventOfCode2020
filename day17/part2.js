const fs = require('fs');

const stringToInput = str => str.trim().split('\n').map(line => line.trim().split(''))

const input = stringToInput(fs.readFileSync('./input.txt', 'utf8'))

const testInput = stringToInput(`
.#.
..#
###
`)

const coordToKey = arr => arr.join(',')
const keyToCoord = str => str.split(',').map(n => parseInt(n))

function generateSpaceAndBounds(matrix) {
    const space = new Set()

    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[0].length; y++) {
            if (matrix[x][y] === '#') {
                space.add(coordToKey([0, 0, x, y]))
            }
        }
    }

    return {space, bounds: [[0, 0], [0, 0], [0, matrix.length - 1], [0, matrix[0].length - 1]]}
}

function getNextPointState(space, [hyper, slice, row, col]) {
    let countActiveNeighbors = 0

    const [minW, maxW] = [hyper - 1, hyper + 1]
    const [minZ, maxZ] = [slice - 1, slice + 1]
    const [minX, maxX] = [row - 1, row + 1]
    const [minY, maxY] = [col - 1, col + 1]

    for (let w = minW; w <= maxW; w++) {
        for (let z = minZ; z <= maxZ; z++) {
            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    if (space.has(coordToKey([w, z, x, y])) && !(w === hyper && z === slice && x === row && y === col)) {
                        countActiveNeighbors++
                    }
                }
            }
        }
    }

    if (space.has(coordToKey([hyper, slice, row, col]))) return countActiveNeighbors === 2 || countActiveNeighbors === 3

    return countActiveNeighbors === 3
}

function stepSpace(prevSpace, [[minW, maxW], [minZ, maxZ], [minX, maxX], [minY, maxY]]) {
    const nextSpace = new Set(prevSpace)

    // let [nextMinZ, nextMinX, nextMinY] = Array(3).fill(Infinity)
    // let [nextMaxZ, nextMaxX, nextMaxY] = Array(3).fill(-Infinity)

    for (let w = minW - 1; w <= maxW + 1; w++) {
        for (let z = minZ - 1; z <= maxZ + 1; z++) {
            for (let x = minX - 1; x <= maxX + 1; x++) {
                for (let y = minY; y <= maxY + 1; y++) {
                    const isActive = getNextPointState(prevSpace, [w, z, x, y])

                    if (isActive) {
                        nextSpace.add(coordToKey([w, z, x, y]))

                        // nextMinZ = Math.min(nextMinZ, z)
                        // nextMinX = Math.min(nextMinX, x)
                        // nextMinY = Math.min(nextMinY, y)
                        //
                        // nextMaxZ = Math.max(nextMaxZ, z)
                        // nextMaxX = Math.max(nextMaxX, x)
                        // nextMaxY = Math.max(nextMaxY, y)

                    } else {
                        nextSpace.delete(coordToKey([w, z, x, y]))
                    }
                }
            }
        }
    }

    return {space: nextSpace, bounds: [[minW - 1, maxW + 1], [minZ - 1, maxZ + 1], [minX - 1, maxX + 1], [minY - 1, maxY + 1]]}


}

function iterate(matrix, iterations) {
    let {space, bounds} = generateSpaceAndBounds(matrix)

    for (let i = 0; i < iterations; i++) {
        ({space, bounds} = stepSpace(space, bounds))
    }

    return space.size
}

const initial = input

const result = iterate(initial, 6)

console.log({result})

console.log('end')

