const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8').trim().split('\n');

// const input = `
// nop +0
// acc +1
// jmp +4
// acc +3
// jmp -3
// acc -99
// acc +1
// jmp -4
// acc +6
// `
//   .trim()
//   .split('\n');


function step({ line, instruction, acc }) {
  if(instruction === undefined) debugger
  const [cmd, num] = instruction.split(' ');

  const buildNum = (str) => {
    const signal = str[0];
    const num = parseInt(str.slice(1, str.length));

    const mult = signal === '+' ? 1 : signal === '-' ? -1 : null;

    if (mult === null) throw new Error('unknown signal');

    return num * mult;
  };

  switch (cmd) {
    case 'nop':
      return { nextLine: line + 1, nextAcc: acc };
    case 'jmp':
      return { nextLine: line + buildNum(num), nextAcc: acc };
    case 'acc':
      return { nextLine: line + 1, nextAcc: acc + buildNum(num) };

    default:
      throw new Error('Unkown instruction');
  }
}

function execute(instructions) {
  const visited = new Set();

  let currentLine = 0;
  let acc = 0;

  while (!visited.has(currentLine) && currentLine < instructions.length) {
    visited.add(currentLine);

    const instruction = instructions[currentLine];
    const { nextLine, nextAcc } = step({ line: currentLine, instruction, acc });

    currentLine = nextLine;
    acc = nextAcc;
  }

  return { acc, currentLine };
}

function fixAndExecute(instructions) {
  let { acc, currentLine } = execute(instructions);

  const isFixable = str => /nop|jmp/.test(str);

  const fixInstructions = (arr, i) => {
    const oldInstruction = arr[i]

    const newInstruction = /nop/.test(oldInstruction)
        ? oldInstruction.replace('nop', 'jmp')
        : oldInstruction.replace('jmp', 'nop');

    const newInstructions = [...instructions]
    newInstructions[i] = newInstruction
    return newInstructions
  }

  let lineFixed = -1

  for(let i = 0; i < instructions.length; i++){
    const currentInstruction = instructions[i]

    if(isFixable(currentInstruction)){
      ({acc, currentLine} = execute(fixInstructions(instructions, i)));
      lineFixed = i
      if(currentLine === instructions.length) break

    }
  }

  if(currentLine < instructions.length) throw new Error('Instructions not fixable')

  return acc
}

const finalAcc = fixAndExecute(input);
console.log({ finalAcc });

console.log('end');
