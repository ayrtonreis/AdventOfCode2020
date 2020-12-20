const fs = require('fs');

const stringToInput = str => {
    const [rulesSection, messagesSection] = str.trim().split('\n\n')

    const rulesMap = new Map(rulesSection.split('\n').map(line => {
        const [id, rule] = line.split(':')
        return [parseInt(id.trim()), rule.trim()]
    }))

    return {
        rules: rulesMap,
        messages: messagesSection.split('\n').map(line => line.trim())
    }
}

const input = stringToInput(fs.readFileSync('./input.txt', 'utf8'))

const testInput = stringToInput(`
0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb
`)

/**
 *
 * @param {Map<number, string>} rulesMap
 * returns {Set<string>}
 */
function generateCombinations(rulesMap) {
    /**
     * @param {string} rule
     * returns {string[]}
     */

    const results = new Map()

    const buildRecursive = (rule, index = null) => {
        if(results.has(index)) {
            //debugger
            return results.get(index)
        }


        rule = rule.trim()
        const unionRules = rule.split('|')

        if (unionRules.length > 1) {
            const result = unionRules.reduce((acc, r) => {
                const partial = buildRecursive(r)
                const newAcc = [...acc, ...partial]
                return newAcc
            }, [])
            return result
        }

        const matchedLetter = /"(.*?)"/.exec(rule)

        if (matchedLetter) {
            const letter = matchedLetter[1]
            results.set(index, [letter])
            return [letter]
        }

        const innerIds = rule.split(' ').map(n => parseInt(n))

        const result = innerIds.reduce((acc, id) => {
            const partialResult = buildRecursive(rulesMap.get(id), id)

            // results.set(id, partialResult)

            const newAcc = acc.map(prev => partialResult.map(curr => prev + curr)).flat()

            return newAcc
        }, [""])

        results.set(index, result)
        return result
    }

    const combinations = buildRecursive(rulesMap.get(0), 0)
    let b = 2
    let c = 1
    return new Set(combinations)
}

/**
 *
 * @param {Map<number, string>} rules
 * @param {string[]} messages
 */
function countPassingMessages(rules, messages){
    const combinations = generateCombinations(rules)
    const filtered = messages.filter(msg => combinations.has(msg))

    return filtered.length
}

const inputObj = input
const {rules, messages} = inputObj
console.time()
const result = countPassingMessages(rules, messages)
console.timeEnd()

console.log({result})


console.log('end')