const assert = require('assert')
const {fullTransformation, transpose, processPattern, findPattern, removeBorders} = require('./part2')

const tests = [

    // Test transpose
    () => {
        const input = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
        const expected = [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
        assert.deepStrictEqual(transpose(input), expected)
    },

    // Test transformations
    () => {
        let input, expected

        // Rotate 90 deg
        input = [[1, 2], [4, 3]]
        expected = [[4, 1], [3, 2]]
        assert.deepStrictEqual(fullTransformation.rot90(input), expected)

        // Rotate 180 deg
        input = [[1, 2], [4, 3]]
        expected = [[3, 4], [2, 1]]
        assert.deepStrictEqual(fullTransformation.rot180(input), expected)

        // Rotate 270 deg
        input = [[1, 2], [4, 3]]
        expected = [[2, 3], [1, 4]]
        assert.deepStrictEqual(fullTransformation.rot270(input), expected)

        // Flip x
        input = [[1, 2], [4, 3]]
        expected = [[2, 1], [3, 4]]
        assert.deepStrictEqual(fullTransformation.flipX(input), expected)

        // Flip y
        input = [[1, 2], [4, 3]]
        expected = [[4, 3], [1, 2]]
        assert.deepStrictEqual(fullTransformation.flipY(input), expected)

        // Flip Principal Diagonal
        input = [[1, 2], [4, 3]]
        expected = [[1, 4], [2, 3]]
        assert.deepStrictEqual(fullTransformation.flipDiag1(input), expected)

        // Flip Secondary Diagonal
        input = [[1, 2], [4, 3]]
        expected = [[3, 2], [4, 1]]
        assert.deepStrictEqual(fullTransformation.flipDiag2(input), expected)

    },

    // Test find pattern
    () => {

        const board = [
            ['#', '#', '#'],
            ['#', '#', '.'],
            ['.', '.', '#'],
        ]
        const pattern =
            `.#
            #.`
        const result = findPattern(board, processPattern(pattern))
        console.log({result})
        console.table(result.board)

    },

    () => {
        const input = [
            [1,2,3,4],
            [1,2,3,4],
            [1,2,3,4],
            [1,2,3,4],
        ]

        const expected = [[2,3],[2,3]]
        assert.deepStrictEqual(removeBorders(input), expected)
    }

    //
    // // Test find matching transformations
    // () => {
    //     let constraints, input, expected
    //
    //     // Test all constraints
    //     constraints = [[1, 2], [2, 3], [4, 3], [1, 4]].map(r => r.map(n => n.toString()))
    //     input = toBorders([[1, 2], [4, 3]])
    //     expected = [constraints]
    //
    //     assert.deepStrictEqual(findMatchingTransformations(input, constraints), expected)
    //
    //     // Test all constraints but no match
    //     input = toBorders([[1, 1], [1, 1]])
    //     expected = []
    //
    //     assert.deepStrictEqual(findMatchingTransformations(input, constraints), expected)
    //
    //     // Test no constraints: all transformations pass
    //     constraints = [null, null, null, null]
    //     input = toBorders([[1, 2], [4, 3]])
    //     assert.strictEqual(findMatchingTransformations(input, constraints).length, 8)
    //
    //     // Test single constraints: 4 possible values, but only 1 unique
    //     constraints = [['1', '2'], null, null, null]
    //     input = toBorders([[1, 2], [2, 1]])
    //     assert.strictEqual(findMatchingTransformations(input, constraints).length, 1)
    //
    //     // Test 2 constraints: 2 possible values, but only 1 unique
    //     constraints = [['1', '3'], null, null, ['1', '3']]
    //     input = toBorders([[1, 3], [3, 1]])
    //     assert.strictEqual(findMatchingTransformations(input, constraints).length, 1)
    //
    // }


]

tests.forEach(func => func())
console.log("\x1b[32m", 'All Passed!')


// const hasAny = checkBorderSymmetry(testInput.map(({block}) => block))
// console.log({hasAny})