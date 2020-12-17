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
class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9
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

function discardInvalidTickets(rules, tickets) {
    const validators = generateValidators(rules)

    const validTickets = tickets.filter(ticket => !ticket.some(n => !applyRules(validators, n)))

    return validTickets
}

function findOrderedFields(rules, tickets) {
    const validTickets = discardInvalidTickets(rules, tickets)
    const totalColumns = validTickets[0].length
    const validators = generateValidators(rules)

    const getColumn = index => validTickets.map(row => row[index])

    let unsolvedRulesByColumn = new Map()
    const solvedRulesByColumn = new Map()

    for (let i = 0; i < totalColumns; i++) {
        const possibleRules = validators
            .filter(({validate}) => getColumn(i).every(n => validate(n)))
            .map(({ruleName}) => ruleName)

        unsolvedRulesByColumn.set(i, possibleRules)
    }

    while (unsolvedRulesByColumn.size > 0) {
        const available = [...unsolvedRulesByColumn.entries()]
        const [index, [solvedField]] = available.find(([_, possible]) => possible.length === 1)

        solvedRulesByColumn.set(index, solvedField)

        unsolvedRulesByColumn = new Map(available.map(([key, possibles]) => [key, possibles.filter(f => f !== solvedField)]))
        unsolvedRulesByColumn.delete(index)
    }

    const orderedFields = [...solvedRulesByColumn.entries()].sort(([a], [b]) => a - b).map(([_, field]) => field)
    return orderedFields
}

function mapTicket(rules, nearbyTickets, myTicket) {
    const orderedFields = findOrderedFields(rules, nearbyTickets)

    const mappedTicket = orderedFields.reduce((acc, field, index) => ({...acc, [field]: myTicket[index]}), {})

    return mappedTicket
}

function multiplyDepartures(ticket) {
    const values = Object.entries(ticket).filter(([field]) => /^departure/.test(field)).map(([_, n]) => n)
    const mult = values.reduce((acc, n) => acc * n, 1)

    return mult
}

const {rules, nearbyTickets, ticket} = input

console.time()
const myTicket = mapTicket(rules, nearbyTickets, ticket)
const result = multiplyDepartures(myTicket === 1940065747861)
console.timeEnd()

console.log({result})

console.log('end')

