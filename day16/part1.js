const fs = require('fs');

const stringToInput = str => {
    const [ruleSection, ticketSection, nearbyTicketSection] = str.trim().split('\n\n')

    const rules = ruleSection.split('\n').map(line => {
        const [ruleName, rangeLine] = line.split(':').map(item => item.trim())
        const ranges = rangeLine.split('or').map(range => range.split('-').map(str => parseInt(str.trim())))

        return {
            ruleName,
            ranges
        }
    })

    const ticket = ticketSection.split('\n')[1].split(',').map(str => parseInt(str.trim()))

    const nearbyTickets = nearbyTicketSection
        .split('\n')
        .slice(1)
        .map(line => line.split(',').map(str => parseInt(str.trim())))

    return {
        rules,
        ticket,
        nearbyTickets,
    }
}

const input = stringToInput(fs.readFileSync('./input.txt', 'utf8'))

const testInput = stringToInput(`
class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12
`)

const generateValidators = rules => {
    const checkInRange = (ranges, n) => ranges.some(([min, max]) => {
        return n >= min && n <= max
    })

    return rules.map(({ruleName, ranges}) => ({
        ruleName,
        validate: n => checkInRange(ranges, n)
    }))
}

function applyRules(validators, n) {
    const isValid = validators.some(({validate}) => validate(n))
    return isValid
}

function getErrorRate(rules, tickets) {
    const validators = generateValidators(rules)

    const errors = tickets.flat().filter(n => !applyRules(validators, n))
    const errorRate = errors.reduce((acc, current) => acc + current, 0)

    return errorRate
}

const {rules, nearbyTickets} = input

console.time()
const errorRate = getErrorRate(rules, nearbyTickets)
console.timeEnd()

console.log({errorRate})

console.log('end')

