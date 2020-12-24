const assert = require('assert')
const {transformations, findMatchingTransformations} = require('./part1-1')

/**
 *
 * @param {(string|number)[][]} matrix
 * @returns {string[][]}
 */
const toBorders = (matrix) => [
    matrix[0].map(el => el.toString()),
    matrix.map(r => r[r.length - 1]).map(el => el.toString()),
    matrix[matrix.length - 1].map(el => el.toString()),
    matrix.map(r => r[0]).map(el => el.toString()),
]

const tests = [

    // Test transformations
    () => {
        let input, expected

        // Rotate 90 deg
        input = toBorders([[1, 2], [4, 3]])
        expected = toBorders([[4, 1], [3, 2]])
        assert.deepStrictEqual(transformations.rot90(input), expected)

        // Rotate 180 deg
        input = toBorders([[1, 2], [4, 3]])
        expected = toBorders([[3, 4], [2, 1]])
        assert.deepStrictEqual(transformations.rot180(input), expected)

        // Rotate 270 deg
        input = toBorders([[1, 2], [4, 3]])
        expected = toBorders([[2, 3], [1, 4]])
        assert.deepStrictEqual(transformations.rot270(input), expected)

        // Flip x
        input = toBorders([[1, 2], [4, 3]])
        expected = toBorders([[2, 1], [3, 4]])
        assert.deepStrictEqual(transformations.flipX(input), expected)

        // Flip y
        input = toBorders([[1, 2], [4, 3]])
        expected = toBorders([[4, 3], [1, 2]])
        assert.deepStrictEqual(transformations.flipY(input), expected)

        // Flip Principal Diagonal
        input = toBorders([[1, 2], [4, 3]])
        expected = toBorders([[1, 4], [2, 3]])
        assert.deepStrictEqual(transformations.flipDiag1(input), expected)

        // Flip Secondary Diagonal
        input = toBorders([[1, 2], [4, 3]])
        expected = toBorders([[3, 2], [4, 1]])
        assert.deepStrictEqual(transformations.flipDiag2(input), expected)

    },

    // Test find matching transformations
    () => {
        let constraints, input, expected

        // Test all constraints
        constraints = [[1, 2], [2, 3], [4, 3], [1, 4]].map(r => r.map(n => n.toString()))
        input = toBorders([[1, 2], [4, 3]])
        expected = [constraints]

        assert.deepStrictEqual(findMatchingTransformations(input, constraints), expected)

        // Test all constraints but no match
        input = toBorders([[1, 1], [1, 1]])
        expected = []

        assert.deepStrictEqual(findMatchingTransformations(input, constraints), expected)

        // Test no constraints: all transformations pass
        constraints = [null, null, null, null]
        input = toBorders([[1, 2], [4, 3]])
        assert.strictEqual(findMatchingTransformations(input, constraints).length, 8)

        // Test single constraints: 4 possible values, but only 1 unique
        constraints = [['1', '2'], null, null, null]
        input = toBorders([[1, 2], [2, 1]])
        assert.strictEqual(findMatchingTransformations(input, constraints).length, 1)

        // Test 2 constraints: 2 possible values, but only 1 unique
        constraints = [['1', '3'], null, null, ['1', '3']]
        input = toBorders([[1, 3], [3, 1]])
        assert.strictEqual(findMatchingTransformations(input, constraints).length, 1)

    }

    // () => {
    //     let input, result
    //
    //     input = [[
    //         ['o', 'x', 'x'],
    //         ['o', 'x', 'x'],
    //         ['o', 'x', 'x']
    //     ]]
    //     result = checkBorderSymmetry(input)
    //     assert.strictEqual(result, true)
    //
    //     input = [[
    //         ['x', '0', 'x'],
    //         ['x', '1', 'x'],
    //         ['x', '2', 'x']
    //     ]]
    //     result = checkBorderSymmetry(input)
    //     assert.strictEqual(result, true)
    //
    //
    //     input = [[
    //         ['x', 'x', 'x'],
    //         ['o', 'x', 'x'],
    //         ['o', 'x', 'x']
    //     ]]
    //     result = checkBorderSymmetry(input)
    //     assert.strictEqual(result, false)
    //
    //     input = [
    //         [
    //             ['o', 'x', 'x'],
    //             ['o', 'x', 'x'],
    //             ['o', 'x', 'x']
    //         ],
    //         [
    //             ['x', 'x', 'x'],
    //             ['o', 'x', 'x'],
    //             ['o', 'x', 'x']
    //         ]
    //     ]
    //     result = checkBorderSymmetry(input)
    //     assert.strictEqual(result, true)
    // },
    //
    // // Test fitConstraints
    // () => {
    //     // top + right + bottom + left
    //     const constraints = [
    //         [['1', 't', '2']],
    //         [
    //             ['2'],
    //             ['r'],
    //             ['3'],
    //         ],
    //         [['4', 'b', '3']],
    //         [
    //             ['1'],
    //             ['l'],
    //             ['4'],
    //         ],
    //     ]
    //
    //     let input, result
    //
    //     // Test Noop
    //     input = [
    //         ['1', 't', '2'],
    //         ['l', 'x', 'r'],
    //         ['4', 'b', '3'],
    //     ]
    //     result = fitConstraints(input, constraints)
    //     assert.strictEqual(result, T.Noop)
    //
    //     // Test Rotation
    //     input = [
    //         ['3', 'b', '4'],
    //         ['r', 'x', 'l'],
    //         ['2', 't', '1'],
    //     ]
    //     result = fitConstraints(input, constraints)
    //     assert.strictEqual(result, T.Rot)
    //
    //     // Test FlipX
    //     input = [
    //         ['2', 't', '1'],
    //         ['r', 'x', 'l'],
    //         ['3', 'b', '4'],
    //     ]
    //     result = fitConstraints(input, constraints)
    //     assert.strictEqual(result, T.FlipX)
    //
    //     // test FlipY
    //     input = [
    //         ['4', 'b', '3'],
    //         ['l', 'x', 'r'],
    //         ['1', 't', '2'],
    //     ]
    //     result = fitConstraints(input, constraints)
    //     assert.strictEqual(result, T.FlipY)
    //
    //     // Test Impossible Transformations
    //     input = [
    //         ['2', 't', '1'],
    //         ['l', 'x', 'r'],
    //         ['3', 'b', '4'],
    //     ]
    //     result = fitConstraints(input, constraints)
    //     assert.strictEqual(result, null)
    //
    //     input = [
    //         ['1', 'x', '2'],
    //         ['x', 'x', 'x'],
    //         ['4', 'x', '3'],
    //     ]
    //     result = fitConstraints(input, constraints)
    //     assert.strictEqual(result, null)
    //
    // }

]

tests.forEach(func => func())
console.log("\x1b[32m", 'All Passed!')


// const hasAny = checkBorderSymmetry(testInput.map(({block}) => block))
// console.log({hasAny})