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

// const intersectSets = (sets) => {
//     const result = sets.reduce((acc, curr) =>{
//         let filtered = [...acc]
//         filtered = filtered.filter(item => curr.has(item))
//         const newAcc = new Set(filtered)
//         return newAcc
//     }, sets[0])
//
//     return result
// }

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

/**
 *
 * @param {string[][][]} equations
 * @param {Set<string>} ingredientsToRemove
 * @returns {*}
 */
function solveIngredientByAllergen(equations, ingredientsToRemove) {
    const allIngredients = new Set(equations.map(([ingredients]) => ingredients).flat())
    const allAllergens = new Set(equations.map(([_, allergens]) => allergens).flat())

    const reducedEquations = equations
        .map(([ingredients, allergens]) => [
            ingredients.filter(item => !ingredientsToRemove.has(item)),
            allergens
        ])

    const remainingIngredients = new Set(reducedEquations.map(([ingredients]) => ingredients).flat())


    /**
     * @type {[string[], string][]}
     */
    let baseEquations = [...allAllergens].map((allergen) => {
        const filteredEquations = reducedEquations.filter(([_, allergens]) => allergens.includes(allergen))
        const intersection = intersectSets(filteredEquations.map(([ingredients]) => new Set(ingredients)))
        return [[...intersection], allergen]
    })

    /**
     * @type {{ingredient: string, allergen: string}[]}
     */
    const solution = []

    while(solution.length < allAllergens.size){
        const pivotEquation = baseEquations.find(([ingredient, allergen]) => ingredient.length === 1)

        const ingredient = pivotEquation[0][0]
        const allergen = pivotEquation[1]

        solution.push({ingredient, allergen})

        baseEquations = baseEquations.filter(eq => eq !== pivotEquation)

        baseEquations.forEach(eq => {
            eq[0] = eq[0].filter(item => item !== ingredient)
        })

    }

    const orderedSolution = solution
        .sort((a, b) => (a.allergen > b.allergen ? 1 : -1))

    return orderedSolution

}

const entries = input


console.time()
const solution = solveEquations(entries)
const ingredientsWithNoAllergens = findIngredientsWithNoAllergens(solution)

const solutionArray = solveIngredientByAllergen(entries, ingredientsWithNoAllergens)
const canonicalList = solutionArray.map(({ingredient}) => ingredient).join(',')

console.timeEnd()

console.log(canonicalList)

console.log('end');
