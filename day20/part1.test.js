const assert = require('assert')
const {testInput, T, fitConstraints} = require('./part1')


/**
 * @param {string[][][]} arr
 * returns {bool}
 */
function checkBorderSymmetry(arr) {

    const checkBlockBorderSymmetry = m => {
        const firstRow = m[0]
        const lastRow = m[m.length - 1]

        const firstCol = m.map(r => r[0])
        const lastCol = m.map(r => r[r.length - 1])

        return JSON.stringify(firstRow) === JSON.stringify(lastRow)
            || JSON.stringify(firstCol) === JSON.stringify(lastCol)
    }

    // const filtered = arr.filter(block => checkBlockBorderSymmetry(block))

    return arr.some(block => checkBlockBorderSymmetry(block))
}

const tests = [
    // () => {
    //     let result = parseFirstLevel('1 + 2 + 3')
    //     assert.equal(result, '1 + 2 + 3')
    //
    //     result = parseFirstLevel('1 + (3*5) + 2')
    //     assert.deepStrictEqual(result, ["1 + ", "3*5", " + 2"])
    // },

    // Test checkBlockBorderSymmetry
    () => {
        let input, result

        input = [[
            ['o', 'x', 'x'],
            ['o', 'x', 'x'],
            ['o', 'x', 'x']
        ]]
        result = checkBorderSymmetry(input)
        assert.strictEqual(result, true)

        input = [[
            ['x', '0', 'x'],
            ['x', '1', 'x'],
            ['x', '2', 'x']
        ]]
        result = checkBorderSymmetry(input)
        assert.strictEqual(result, true)


        input = [[
            ['x', 'x', 'x'],
            ['o', 'x', 'x'],
            ['o', 'x', 'x']
        ]]
        result = checkBorderSymmetry(input)
        assert.strictEqual(result, false)

        input = [
            [
                ['o', 'x', 'x'],
                ['o', 'x', 'x'],
                ['o', 'x', 'x']
            ],
            [
                ['x', 'x', 'x'],
                ['o', 'x', 'x'],
                ['o', 'x', 'x']
            ]
        ]
        result = checkBorderSymmetry(input)
        assert.strictEqual(result, true)
    },

    // Test fitConstraints
    () => {
        // top + right + bottom + left
        const constraints = [
            [['1', 't', '2']],
            [
                ['2'],
                ['r'],
                ['3'],
            ],
            [['4', 'b', '3']],
            [
                ['1'],
                ['l'],
                ['4'],
            ],
        ]

        let input, result

        // Test Noop
        input = [
            ['1', 't', '2'],
            ['l', 'x', 'r'],
            ['4', 'b', '3'],
        ]
        result = fitConstraints(input, constraints)
        assert.strictEqual(result, T.Noop)

        // Test Rotation
        input = [
            ['3', 'b', '4'],
            ['r', 'x', 'l'],
            ['2', 't', '1'],
        ]
        result = fitConstraints(input, constraints)
        assert.strictEqual(result, T.Rot)

        // Test FlipX
        input = [
            ['2', 't', '1'],
            ['r', 'x', 'l'],
            ['3', 'b', '4'],
        ]
        result = fitConstraints(input, constraints)
        assert.strictEqual(result, T.FlipX)

        // test FlipY
        input = [
            ['4', 'b', '3'],
            ['l', 'x', 'r'],
            ['1', 't', '2'],
        ]
        result = fitConstraints(input, constraints)
        assert.strictEqual(result, T.FlipY)

        // Test Impossible Transformations
        input = [
            ['2', 't', '1'],
            ['l', 'x', 'r'],
            ['3', 'b', '4'],
        ]
        result = fitConstraints(input, constraints)
        assert.strictEqual(result, null)

        input = [
            ['1', 'x', '2'],
            ['x', 'x', 'x'],
            ['4', 'x', '3'],
        ]
        result = fitConstraints(input, constraints)
        assert.strictEqual(result, null)

    }

]

tests.forEach(func => func())
console.log("\x1b[32m", 'All Passed!')


// const hasAny = checkBorderSymmetry(testInput.map(({block}) => block))
// console.log({hasAny})