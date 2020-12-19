const assert = require('assert')
const {parseFirstLevel, getToken, parse, evaluate} = require('./part2')


const tests = [
    () => {
        let result = parseFirstLevel('1 + 2 + 3')
        assert.equal(result, '1 + 2 + 3')

        result = parseFirstLevel('1 + (3*5) + 2')
        assert.deepStrictEqual(result, ["1 + ", "3*5", " + 2"])
    },

    // Test Numbers
    () => {
        let result = getToken('50')
        assert.deepStrictEqual(result, {
            token: {type: 'Number', value: 50},
            end: 2,
        })

        result = getToken('50+')
        assert.deepStrictEqual(result, {
            token: {type: 'Number', value: 50},
            end: 2,
        })
    },

    // Test Operators
    () => {
        let result = getToken('+2')
        assert.deepStrictEqual(result, {
            token: {type: '+'},
            end: 1,
        })

        result = getToken('-(3+2)')
        assert.deepStrictEqual(result, {
            token: {type: '-'},
            end: 1,
        })

        result = getToken('*(3+2)')
        assert.deepStrictEqual(result, {
            token: {type: '*'},
            end: 1,
        })
    },

    // Test Parentheses
    () => {
        let result = getToken('()')
        assert.deepStrictEqual(result, {
            token: {type: 'Expression', value: ''},
            end: 2,
        })

        let inner = '1+2+3'
        result = getToken(`(${inner})`)
        assert.deepStrictEqual(result, {
            token: {type: 'Expression', value: inner},
            end: inner.length + 2,
        })

        inner = '((2+4)*5+2*(3+3))'
        result = getToken(`(${inner})`)
        assert.deepStrictEqual(result, {
            token: {type: 'Expression', value: inner},
            end: inner.length + 2,
        })

        inner = '((1+(5*(3+1)))*((2+3)*(2+1)))'
        result = getToken(`(${inner})`)
        assert.deepStrictEqual(result, {
            token: {type: 'Expression', value: inner},
            end: inner.length + 2,
        })
    },

    // Test parser
    () => {
        // Test 1
        // result is an Abstract Syntax Tree
        let result = parse('1+2')
        assert.deepStrictEqual(result, {
            type: '+',
            leftChild: {
              type: 'Number',
              value: 1,
            },
            rightChild: {
                type: 'Number',
                value: 2,
            },
        })

        // Test 2
        result = parse('1+2*3-1')
        assert.deepStrictEqual(result, {
            type: '+',
            leftChild: {
                type: 'Number',
                value: 1,
            },
            rightChild: {
                type: '*',
                leftChild: {
                    type: 'Number',
                    value: 2,
                },
                rightChild: {
                    type: '-',
                    leftChild: {
                        type: 'Number',
                        value: 3,
                    },
                    rightChild: {
                        type: 'Number',
                        value: 1,
                    },
                },
            },
        })

        // Test 3
        result = parse('1+(2-3)*4')
        assert.deepStrictEqual(result, {
            type: '+',
            leftChild: {
                type: 'Number',
                value: 1,
            },
            rightChild: {
                type: '*',
                leftChild: {
                    type: '-',
                    leftChild: {
                        type: 'Number',
                        value: 2,
                    },
                    rightChild: {
                        type: 'Number',
                        value: 3,
                    },
                },
                rightChild: {
                    type: 'Number',
                    value: 4,
                },
            },
        })

        // Test 4
        result = parse('((1+2)*(4-3))+((1+2)*2)')
        assert.deepStrictEqual(result, {
            type: '+',
            leftChild: {
                type: '*',
                leftChild: {
                    type: '+',
                    leftChild: {
                        type: 'Number',
                        value: 1,
                    },
                    rightChild: {
                        type: 'Number',
                        value: 2,
                    }
                },
                rightChild: {
                    type: '-',
                    leftChild: {
                        type: 'Number',
                        value: 4
                    },
                    rightChild: {
                        type: 'Number',
                        value: 3
                    },
                }
            },
            rightChild: {
                type: '*',
                leftChild: {
                    type: '+',
                    leftChild: {
                        type: 'Number',
                        value: 1,
                    },
                    rightChild: {
                        type: 'Number',
                        value: 2,
                    },
                },
                rightChild: {
                    type: 'Number',
                    value: 2,
                },
            },
        })
    },

    // Test evaluate
    () => {
        let expression, result

        // Test 1
        expression = '1 + 2'
        result = evaluate(expression)
        assert.strictEqual(result, 3)

        // Test 2
        expression = '1 + 2 * 3'
        result = evaluate(expression)
        assert.strictEqual(result, 9)

        // Test 3
        expression = '1 + 2 * 3 + 4 * 5 + 6'
        result = evaluate(expression)
        assert.strictEqual(result, 231)

        // Test 4
        expression = '1 + (2 * 3) + (4 * (5 + 6))'
        result = evaluate(expression)
        assert.strictEqual(result, 51)

        // Test 5
        expression = '5 + (8 * 3 + 9 + 3 * 4 * 3)'
        result = evaluate(expression)
        assert.strictEqual(result, 1445)

        // Test 6
        expression = '5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))'
        result = evaluate(expression)
        assert.strictEqual(result, 669060)

        // Test 7
        expression = '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2'
        result = evaluate(expression)
        assert.strictEqual(result, 23340)
    }
]

tests.forEach(func => func())
console.log("\x1b[32m", 'All Passed!')
