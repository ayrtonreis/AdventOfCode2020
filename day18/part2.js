const fs = require('fs');

const stringToInput = str => str.trim().split('\n').map(line => line.trim().split(''))

const input = stringToInput(fs.readFileSync('./input.txt', 'utf8'))

const testInput = stringToInput(`

`)



console.log('end')