const fs = require('fs');

function buildInput(str) {
    const lines = str.trim().split('\n')
    const processedLines = lines.map(l => {
        const [ingredientsSections, allergensSection] = l.split(/\(([^)]+)\)/)
        const ingredients = ingredientsSections.trim().split(' ').map(item => item.trim())
        const allergens = allergensSection
            .replace('contains', '')
            .trim()
            .split(',')
            .map(item => item.trim())

        return [ingredients, allergens]
    })
    return processedLines
}

const testInput = buildInput(`
mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)
`)


const input = buildInput(fs.readFileSync('./input.txt', 'utf8'))

/**
 *
 * @param {string[][][]} entries
 * @returns {Set<string>[][]}
 */
function buildEquations(entries) {
    const equations = entries
        .map(([ingredients, allergens]) => [new Set(ingredients), new Set(allergens)])

    return equations
}

const unionSets = (...arrays) => new Set(arrays.flat())

/**
 *
 * @param {Set<*>[]} sets
 * @returns {Set<*>}
 */
const intersectSets = (sets) => sets
    .reduce((acc, currSet) => new Set([...acc].filter(item => currSet.has(item))), sets[0])


const diffSets = (s1, s2) => new Set([...s1].filter(item => !s2.has(item)))

/**
 *
 * @param {string[][][]} entries
 * @returns {Map<string, Set<string>>}
 */
function solveEquations(entries) {
    const equations = buildEquations(entries)

    const prevPivots = new Set()

    while (true) {
        const pivotEquation = equations.find((eq) => eq[1].size === 1 && !prevPivots.has(eq))

        if (!pivotEquation) break

        const currAllergen = pivotEquation[1].values().next().value

        const filteredEquations = equations
            .filter(([_, allergens]) => allergens.has(currAllergen) && allergens !== pivotEquation[1])


        const possible = intersectSets([pivotEquation, ...filteredEquations].map(([ingredients]) => ingredients))

        pivotEquation[0] = possible
        pivotEquation[1] = new Set([currAllergen])

        prevPivots.add(pivotEquation)

        filteredEquations.forEach(eq => {
            if (!prevPivots.has(eq)) {
                // console.group()
                // console.log(eq)
                eq[0] = diffSets(eq[0], pivotEquation[0])
                eq[1].delete(currAllergen)
                // console.log(eq)
                // console.groupEnd()
            }
        })
    }

    const solution = new Map(
        entries
            .map(([ingredients]) => ingredients)
            .flat().map(item => [item, new Set()])
    )

    equations.forEach(([ingredients, allergens]) => {
        ingredients.forEach(ingredient => {
            const set = solution.get(ingredient)
            allergens.forEach(allergen => set.add(allergen))
        })
    })

    return solution
}

/**
 *
 * @param {Map<string, Set<string>>} solution
 * @returns {Set<string>}
 */
function findIngredientsWithNoAllergens(solution) {
    const result = Array.from(solution
        .entries())
        .filter(([_, allergens]) => allergens.size === 0)
        .map(([ingredient]) => ingredient)

    return new Set(result)
}

/**
 *
 * @param {string[][][]} entries
 * @param {Set<string>} selectedIngredients
 * @returns {number}
 */
function countIngredients(entries, selectedIngredients) {
    const count = entries.reduce((acc, [ingredients]) => {
        const partialSum = ingredients.reduce((acc1, item) => acc1 + (selectedIngredients.has(item) ? 1 : 0), 0)
        return acc + partialSum
    }, 0)

    return count
}

const entries = input

// const equations = buildEquations(arr)
// const possibilities = mapPossibilities(arr)

console.time()
const solution = solveEquations(entries)
const filteredIngredients = findIngredientsWithNoAllergens(solution)
const count = countIngredients(entries, filteredIngredients)
console.timeEnd()

console.log(count)

console.log('end');
