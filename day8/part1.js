const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8').trim().split('\n');

function step({ line, instruction, acc }) {
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

  return acc;
}

const finalAcc = execute(input);
console.log({ finalAcc });

console.log('end');
