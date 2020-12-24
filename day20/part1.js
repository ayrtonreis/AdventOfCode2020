const fs = require('fs');

const stringToInput = str => str.trim().split('\n\n').map(section => {
    const [header, ...rows] = section.trim().split('\n')

    const id = parseInt(/\d+/.exec(header)[0])
    const block = rows.map(r => r.trim().split(''))

    return {id, block}
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
`)

// available transformations
const T = {
    Noop: 'Noop',
    Rot: 'R180',
    FlipX: 'FlipX',
    FlipY: 'FlipY',
}

const B = {
    Top: 'Top',
    Right: 'Right',
    Bottom: 'Bottom',
    Left: 'Left',
}

const rotateBorders = () => {

}

/**
 * Verifies if there is a configuration that fits the constraints
 * @param {string[][]} block
 * @param {string[][]} top
 * @param {string[][]} right
 * @param {string[][]} bottom
 * @param {string[][]} left
 * @returns {string|null} - the configuration that passes the constraints or null
 *
 * @note: there may be more than 1 configuration that fit the constraints,
 *   but we are interested in only one (the input does not have blocks with symmetry)
 */
function fitConstraints(block, [top, right, bottom, left]) {
    const blockTop = block[0]
    const blockRight = block.map(r => r[r.length - 1])
    const blockBottom = block[block.length - 1]
    const blockLeft = block.map(r => r[0])

    const reverse = arr => [...arr].reverse()

    const noop = () => {
        return JSON.stringify([
            blockTop,               // new top
            blockRight,             // new right
            blockBottom,            // new bottom
            blockLeft,              // new left
        ])
    }

    const rotate = () => {
        return JSON.stringify([
            reverse(blockBottom),   // new top
            reverse(blockLeft),     // new right
            reverse(blockTop),      // new bottom
            reverse(blockRight),    // new left
        ])
    }

    const flipX = () => {
        return JSON.stringify([
            reverse(blockTop),      // new top
            blockLeft,              // new right
            reverse(blockBottom),   // new bottom
            blockRight,             // new left
        ])
    }

    const flipY = () => {
        return JSON.stringify([
            blockBottom,            // new top
            reverse(blockRight),    // new right
            blockTop,               // new bottom
            reverse(blockLeft),     // new left
        ])
    }

    const constraintTop = top[top.length - 1]
    const constraintRight = right.map(r => r[0])
    const constraintBottom = bottom[0]
    const constraintLeft = left.map(r => r[r.length - 1])

    const constraintBorder = JSON.stringify([
        constraintTop,
        constraintRight,
        constraintBottom,
        constraintLeft
    ])

    if (noop() === constraintBorder) return T.Noop
    if (rotate() === constraintBorder) return T.Rot
    if (flipX() === constraintBorder) return T.FlipX
    if (flipY() === constraintBorder) return T.FlipY

    return null // no transformation passed
}


/**
 *
 * @param {{transformation: string, block: string[][]}} top
 * @param {{transformation: string, block: string[][]}} right
 * @param {{transformation: string, block: string[][]}} bottom
 * @param {{transformation: string, block: string[][]}} left
 * @returns {string[][][]} - borders of the boundaries with the transformations applied
 */
function extractConstraints([top, right, bottom, left]) {
    const transformations = {
        [T.Noop]: (m, targetBorder) => {
            const tMap = {
                [B.Top]: m[0],
                [B.Right]: m.map(r => r[r.length - 1]),
                [B.Bottom]: m[m.length - 1],
                [B.Left]: m.map(r => r[0]),
            }
            return tMap[targetBorder]
        },
        [T.Rot]: (m, targetBorder) => {
            const tMap = {
                [B.Top]: [...m[m.length - 1]].reverse(),
                [B.Right]: [...m.map(r => r[0])].reverse(),
                [B.Bottom]: [...m[0]].reverse(),
                [B.Left]: [...m.map(r => r[r.length - 1])].reverse(),
            }
            return tMap[targetBorder]
        },
        [T.FlipX]: (m, targetBorder) => {
            const tMap = {
                [B.Top]: [...m[0]].reverse(),
                [B.Right]: m.map(r => r[0]),
                [B.Bottom]: [...m[m.length - 1]].reverse(),
                [B.Left]: m.map(r => r[r.length - 1]),
            }
            return tMap[targetBorder]
        },
        [T.FlipY]: (m, targetBorder) => {
            const tMap = {
                [B.Top]: m[m.length - 1],
                [B.Right]: m.map(r => r[r.length - 1]).reverse(),
                [B.Bottom]: m[0],
                [B.Left]: m.map(r => r[0]).reverse(),
            }
            return tMap[targetBorder]
        },
    }

    const targetByBoundary = {
        [B.Top]: bottom,
        [B.Right]: left,
        [B.Bottom]: top,
        [B.Left]: right,
    }

    const result = Object.entries(targetByBoundary)
        .map(([type, {transformation, block}]) => transformation[transformation](block, type))

    return result
}

/**
 * @param {{id: number, block: string[][]}[]} blocksWithIds
 * @returns {number[][]} - matrix populated with the ids of the fitting blocks
 */
function findConfiguration(blocksWithIds) {
    const inputMap = new Map(blocksWithIds.map(({id, block}) => [id, block]))


}


console.log('end')

module.exports = {testInput, T, fitConstraints}