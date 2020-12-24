const fs = require('fs');

const stringToInput = str => str.trim().split('\n\n').map(section => {
    const [header, ...rows] = section.trim().split('\n')

    const id = parseInt(/\d+/.exec(header)[0])
    const block = rows.map(r => r.trim().split(''))

    const top = block[0]
    const right = block.map(r => r[r.length - 1])
    const bottom = block[block.length - 1]
    const left = block.map(r => r[0])

    return {id, block: [top, right, bottom, left], fullBlock: block}
})

const input = stringToInput(fs.readFileSync('./input.txt', 'utf8'))

const testInput = stringToInput(`
Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...
`)

// const testInput = stringToInput(`
// 1:
// 12
// 34
//
// 2:
// 23
// 45
//
// 3:
// 34
// 67
//
// 4:
// 45
// 78
// `)

const transformations = {
    noop: matrix => matrix,
    rot90: ([top, right, bottom, left]) => [
        [...left].reverse(),
        top,
        [...right].reverse(),
        bottom
    ],
    rot180: ([top, right, bottom, left]) => [
        [...bottom].reverse(),
        [...left].reverse(),
        [...top].reverse(),
        [...right].reverse()
    ],
    rot270: ([top, right, bottom, left]) => [
        right,
        [...bottom].reverse(),
        left,
        [...top].reverse()
    ],
    flipX: ([top, right, bottom, left]) => [
        [...top].reverse(),
        left,
        [...bottom].reverse(),
        right
    ],
    flipY: ([top, right, bottom, left]) => [
        bottom,
        [...right].reverse(),
        top,
        [...left].reverse()
    ],
    flipDiag1: ([top, right, bottom, left]) => [left, bottom, right, top],
    flipDiag2: ([top, right, bottom, left]) => [
        [...right].reverse(),
        [...top].reverse(),
        [...left].reverse(),
        [...bottom].reverse()
    ],
}

/**
 *
 * @param string[] top
 * @param string[] right
 * @param string[] bottom
 * @param string[] left
 * @param (string[]|null)[] constraints - constraints for top, right, bottom, left or null if a constraint is empty
 * @returns {string[][][]} configurations that passes the constraint (can be from 0 to 8)
 */
function findMatchingTransformations([top, right, bottom, left], constraints) {
    const are2DArraysEqual = (first, second) => {
        return first.every((currentArray, index) => second[index] === null
            || JSON.stringify(currentArray) === JSON.stringify(second[index]))
    }

    // Using a map because the stringified arrays will be keys
    // This is a trick to avoid duplicated arrays, since this would not work with a set
    const matching = new Map()

    Object.values(transformations).forEach(transformation => {
        const transformed = transformation([top, right, bottom, left])

        if (are2DArraysEqual(transformed, constraints)) {
            matching.set(JSON.stringify(transformed), transformed)
        }
    })

    return Array.from(matching.values())
}

/**
 * @typedef {{id: number, block: string[][]}} BlocksWithId
 */

/**
 *
 * @param {{id: number, configuration: string[][]}[][]} oldBoard
 * @param {number} row
 * @param {number} col
 * @param {{id: number, configuration: string[][]}} value
 * @returns {{id: number, configuration}[][]}
 */
const populateBoard = (oldBoard, row, col, value) => {
    const newBoard = [...oldBoard]
    newBoard[row] = [...newBoard[row]]
    newBoard[row][col] = value

    return newBoard
}

/**
 *
 * @param {number} row - current row
 * @param {number} col - currentColumn
 * @param {{id: number, configuration: string[][]}[][]} prevPopulatedBoard - populated board
 * @param {Set<number>} availableIds - set of available block ids
 */
function findRecursive([row, col], prevPopulatedBoard, availableIds, blocksById) {
    // The board will be populated top to bottom, left to right,
    // therefore, we'll have at most 2 constraints at a time
    const topConstraint = row === 0 ? null : prevPopulatedBoard[row - 1][col].configuration[2]
    const leftConstraint = col === 0 ? null : prevPopulatedBoard[row][col - 1].configuration[1]
    // top, right, bottom, left constraints
    const constraints = [topConstraint, null, null, leftConstraint]


    // Base case
    if (availableIds.size === 1) {
        if (row !== prevPopulatedBoard.length - 1 || col !== prevPopulatedBoard[0].length - 1) throw new Error('More empty spots, but now enough blocks')

        const id = Array.from(availableIds.values())[0]
        const currentBoard = blocksById.get(id)
        const possibleConfigurations = findMatchingTransformations(currentBoard, constraints)

        if (possibleConfigurations.length > 0) {
            if (row === prevPopulatedBoard.length - 1 && col === prevPopulatedBoard[0].length - 1) {
                return populateBoard(prevPopulatedBoard, row, col, {id, configuration: possibleConfigurations[0]})
            }
            // Finished traversing the Depth Search without a viable solution
            return null
        }
    }

    if (availableIds.size === 0) {
        throw new Error('No more available ids to check')
    }

    const [nextRow, nextCol] = [
        (col + 1) % prevPopulatedBoard[0].length !== 0 ? row : row + 1,
        (col + 1) % prevPopulatedBoard[0].length
    ]

    for (const id of availableIds) {
        const currentBoard = blocksById.get(id)
        const newAvailableIds = new Set(availableIds)
        newAvailableIds.delete(id)

        const possibleConfigurations = findMatchingTransformations(currentBoard, constraints)

        for (const config of possibleConfigurations) {
            const newPopulatedBoard = populateBoard(prevPopulatedBoard, row, col, {id, configuration: config})

            const result = findRecursive(
                [nextRow, nextCol],
                newPopulatedBoard,
                newAvailableIds,
                blocksById,
            )

            // A solution final successful solution was found
            if (result !== null) return result
        }
    }

    // No solution found using this path. The algorithm will backtrack
    return null
}

/**
 * @param {BlocksWithId[]} blocksWithIds
 * @returns {string[][][][]} - matrix of blocks
 */
function findConfiguration(blocksWithIds) {
    const blocksById = new Map(blocksWithIds.map(({id, block}) => [id, block]))
    const fullBlocksById = new Map(blocksWithIds.map(({id, fullBlock}) => [id, fullBlock]))

    const side = Math.sqrt(blocksWithIds.length)

    if (side * side !== blocksWithIds.length) throw Error('Board is not Square')

    const initialBoard = Array(side).fill(Array(side).fill(null))
    const initialIdsAvailable = new Set(blocksById.keys())

    const finalBoard = findRecursive([0, 0], initialBoard, initialIdsAvailable, blocksById)
    const populatedFinalBoard = finalBoard.map(r => r.map(({id}) => fullBlocksById.get(id)))

    return populatedFinalBoard

}

const transpose = m => m.map((_, i) => m.map(r => r[i]))

const fullTransformation = {
    noop: m => m,
    rot90: m => transpose(m).map(r => [...r].reverse()),
    rot180: m => m.reverse().map(r => [...r].reverse()),
    rot270: m => transpose(m).reverse(),
    flipX: m => m.map(r => [...r].reverse()),
    flipY: m => [...m].reverse(),
    flipDiag1: m => transpose(m),
    flipDiag2: m => transpose(m).reverse().map(r => [...r].reverse()),
}

/**
 *
 * @param str
 * @returns {string[][]}
 */
function processPattern(str) {
    const result = str.trim().split('\n').map(l => l.trim().split(''))
    return result
}

/**
 *
 * @param {string[][]} board
 * @param {string[][]} pattern
 * returns {{count: number, board: string[][]}}
 */
function findPattern(board, pattern) {
    const possibleBoards = Object.values(fullTransformation).map(func => JSON.parse(JSON.stringify(func(board))))

    for (const currentBoard of possibleBoards){
        const [boardHeight, boardWidth] = [currentBoard.length, currentBoard[0].length]
        const [patternHeight, patternWidth] = [pattern.length, pattern[0].length]
        let patternCount = 0

        for (let row = 0; row <= boardHeight - patternHeight; row++) {
            for (let col = 0; col <= boardWidth - patternWidth; col++) {

                const found = pattern.every(
                    (pR, r) =>
                        pR.every((_, c) => !(pattern[r][c] === '#' && currentBoard[row + r][col + c] !== '#'))
                )

                if (found) {
                    debugger
                    patternCount++

                    pattern.forEach(
                        (pR, r) =>
                            pR.forEach((_, c) => {
                                if (pattern[r][c] === '#' && currentBoard[row + r][col + c] === '#') {
                                    currentBoard[row + r][col + c] = 'O'
                                }
                            })
                    )

                }

            }
        }

        if(patternCount > 0){
            return {count: patternCount, board: currentBoard}
        }
    }


    return {count: 0, board}
}

/**
 *
 * @param {*[][]} block
 * @returns {*[][]}
 */
function removeBorders(block){
    const newBlock = JSON.parse(JSON.stringify(block))
    newBlock.pop()
    newBlock.shift()

    newBlock.forEach(row =>{
        row.pop()
        row.shift()
    })

    return newBlock
}

/**
 *
 * @param {string[][][][]} m
 */
function mergeBlocks(m){
    m = JSON.parse(JSON.stringify(m))

    for(let r = 0; r < m.length; r++){
        for(let c = 0; c < m[0].length; c++){
            m[r][c] = removeBorders(m[r][c])
        }
    }


    const rows = []

    const innerBlockRowLength = m[0][0].length

    for(const row of m){
        const mergedInner = row.reduce((acc, block) =>{

            for(let ri=0; ri< acc.length; ri++){
                acc[ri] = [...acc[ri], ...block[ri]]
            }
            return acc
        }, Array(innerBlockRowLength).fill([]))

        rows.push(mergedInner)
    }

    return rows.flat()

}

const pattern =
`
..................#. 
#....##....##....###
.#..#..#..#..#..#...
`

const arr = testInput

console.time()
const assembledBoard = mergeBlocks(findConfiguration(arr))
// console.table(fullTransformation.flipDiag2(assembledBoard))
const result = findPattern(assembledBoard, processPattern(pattern))
console.table(result.board)

console.timeEnd()

// console.log({result})

console.log('end')

module.exports = {
    testInput,
    transformations,
    findMatchingTransformations,
    transpose,
    fullTransformation,
    processPattern,
    findPattern,
    removeBorders
}