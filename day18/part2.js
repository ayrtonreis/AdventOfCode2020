const fs = require('fs');

const stringToInput = str => str.trim().split('\n')

const input = stringToInput(fs.readFileSync('./input.txt', 'utf8'))


function parseFirstLevel(str) {
    const result = []

    let current = ''
    let countCurrentParens = 0

    str.split('').forEach((c, index, arr) => {
        if (c === '(') {
            if (countCurrentParens === 0) {
                result.push(current)
                current = ''
            } else {
                current += c
            }

            countCurrentParens++

        } else if (c === ')') {
            if (countCurrentParens > 1) {
                current += c
            } else if (countCurrentParens === 1) {
                result.push(current)

                current = ''
                countCurrentParens = 0
            } else {
                throw new Error('Unbalanced Parentheses')
            }

        } else {
            current += c
        }

        if (index === arr.length - 1 && current !== '') {
            result.push(current)
            current = ''
        }
    })

    return result
}

/**
 *
 * @param {string} str
 * @param {number} start
 * @returns {{token: Object|null, end: number}}
 */
function getToken(str, start = 0) {
    if (start >= str.length) return {token: null, end: start}


    const firstChar = str.charAt(start)

    if (!Number.isNaN(parseInt(firstChar))) {
        const matched = /^\d+/.exec(str.substring(start))
        return {
            token: {
                type: 'Number',
                value: parseInt(matched[0])
            },
            end: start + matched[0].length
        }
    }

    if (firstChar === '+') {
        return {
            token: {
                type: '+',
            },
            end: start + 1
        }
    }

    if (firstChar === '-') {
        return {
            token: {
                type: '-',
            },
            end: start + 1
        }
    }

    if (firstChar === '*') {
        return {
            token: {
                type: '*',
            },
            end: start + 1
        }
    }

    if (firstChar === '(') {
        let pos = start + 1
        let openedParens = 1


        while (openedParens !== 0) {
            if (pos >= str.length) throw new SyntaxError('Unclosed Parens')

            if (str.charAt(pos) === '(') openedParens++
            else if (str.charAt(pos) === ')') openedParens--

            pos++
        }

        return {
            token: {
                type: 'Expression',
                value: str.substring(start+1, pos - 1),
            },
            end: pos
        }
    }

    throw new SyntaxError('Token not recognized')
}

/**
 * Parses an expression and returns an Abstract Syntax Trees
 * @param {string} str
 * @returns {Object}
 */
function parse(str) {
    const {token: firstToken, end: firstEnd} = getToken(str)
    const {token: secondToken, end: secondEnd} = getToken(str, firstEnd)

    // Base case
    if (firstToken.type === 'Number' && secondToken === null) {
        // type and value
        return firstToken
    }

    if (firstToken.type === 'Expression') {
        if (secondToken === null) return parse(firstToken.value)

        return {
            type: secondToken.type,
            leftChild: parse(firstToken.value),
            rightChild: parse(str.substring(secondEnd)),
        }
    }

    if (['+', '-', '*'].includes(secondToken.type)) {
        return {
            type: secondToken.type,
            leftChild: firstToken.type === 'Number' ? firstToken : parse(firstToken.value),
            rightChild: parse(str.substring(secondEnd)),
        }
    }

    throw new SyntaxError(`Invalid syntax: 
        First token is '${firstToken && (firstToken.value || firstToken.type)}',
        Second token is '${secondToken && (secondToken.value || secondToken.type)}'
    `)
}

function buildAST(str) {
    // remove all empty spaces and parse the expression
    return parse(str.replace(/ /g, ''))
}

// function evaluate(str) {
//     const evaluateNode = ({type, value, leftChild, rightChild}) => {
//         if (type === 'Number') return value
//
//         const isRightChildOperation = ['+', '-', '*'].includes(rightChild.type)
//
//         if (type === '+') {
//             if (!isRightChildOperation) return evaluateNode(leftChild) + evaluateNode(rightChild)
//
//             const newNode = {
//                 type: rightChild.type,
//                 leftChild: {
//                     type: 'Number',
//                     value: evaluateNode(leftChild) + evaluateNode(rightChild.leftChild)
//                 },
//                 rightChild: rightChild.rightChild
//             }
//
//             return evaluateNode(newNode)
//         }
//
//         if (type === '-') {
//             if (!isRightChildOperation) return evaluateNode(leftChild) - evaluateNode(rightChild)
//
//             const newNode = {
//                 type: rightChild.type,
//                 leftChild: {
//                     type: 'Number',
//                     value: evaluateNode(leftChild) - evaluateNode(rightChild.leftChild)
//                 },
//                 rightChild: rightChild.rightChild
//             }
//
//             return evaluateNode(newNode)
//         }
//
//         if (type === '*') {
//             if (!isRightChildOperation) return evaluateNode(leftChild) * evaluateNode(rightChild)
//
//             const newNode = {
//                 type: rightChild.type,
//                 leftChild: {
//                     type: 'Number',
//                     value: evaluateNode(leftChild) * evaluateNode(rightChild.leftChild)
//                 },
//                 rightChild: rightChild.rightChild
//             }
//
//             return evaluateNode(newNode)
//         }
//
//         // if(type === '+') return evaluateNode(leftChild) + evaluateNode(rightChild)
//         // if(type === '-') return evaluateNode(leftChild) - evaluateNode(rightChild)
//         // if(type === '*') return evaluateNode(leftChild) * evaluateNode(rightChild)
//
//         throw new Error(`Invalid node type: ${type}`)
//     }
//
//     const ast = buildAST(str)
//     return evaluateNode(ast)
// }

function evaluate(str) {
    str = str.replace(/ /g, '')

    const isOperation = type => ['+', '-', '*'].includes(type)
    const operation = {
        '+': (left, right) => left + right,
        '-': (left, right) => left - right,
        '*': (left, right) => left * right,
    }


    let pos = 0
    let acc = 0

    while (pos < str.length) {
        const {token: firstToken, end: firstEnd} = getToken(str, pos)
        pos = firstEnd

        if (pos >= str.length)
            return firstToken.type === 'Number'
                ? firstToken.value
                : firstToken.type === 'Expression'
                    ? evaluate(firstToken.value)
                    : new Error('Final token is invalid')

        const {token: secondToken, end: secondEnd} = getToken(str, pos)
        pos = secondEnd

        if (isOperation(firstToken.type)) {
            const leftValue = acc

            if(firstToken.type === '*')
                return acc * evaluate(str.substring(firstEnd))


            const rightValue = secondToken.type === 'Number'
                ? secondToken.value
                : secondToken.type === 'Expression'
                    ? evaluate(secondToken.value)
                    : new Error('Left side is not a value, nor an expression')


            const result = operation[firstToken.type](leftValue, rightValue)
            acc = result
        } else {
            const {token: thirdToken, end: thirdEnd} = getToken(str, pos)
            pos = thirdEnd

            const leftValue = firstToken.type === 'Number'
                ? firstToken.value
                : firstToken.type === 'Expression'
                    ? evaluate(firstToken.value)
                    : new Error('Left side is not a value, nor an expression')

            const rightValue = thirdToken.type === 'Number'
                ? thirdToken.value
                : thirdToken.type === 'Expression'
                    ? evaluate(thirdToken.value)
                    : null

            if (isOperation(secondToken.type)) {
                if(secondToken.type === '*')
                    return leftValue * evaluate(str.substring(secondEnd))

                const result = operation[secondToken.type](leftValue, rightValue)
                acc = result
            } else {
                throw new Error('Invalid second token type')
            }
        }


    }

    return acc

}

const arr = input

console.time()
const partialResults = arr.map(str => evaluate(str))
const result = partialResults.reduce((acc, curr) => acc + curr, 0)
console.timeEnd()

console.log({result})

console.log('end')

module.exports = {parseFirstLevel, getToken, parse, stringToInput, evaluate}