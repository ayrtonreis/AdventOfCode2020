const fs = require('fs');

// const input = fs.readFileSync('./input.txt', 'utf8').trim().split('\n');
const input = `
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6
`
  .trim()
  .split('\n');

function step({ line, instruction, acc }) {
  const [cmd, num] = instruction.split(' ');

  switch (cmd) {
    case 'nop':
      return { nextLine: line + 1, nextAcc: acc };
    case 'jmp':
      return { nextLine: line + parseInt(num), nextAcc: acc };
    case 'acc':
      return { nextLine: line + 1, nextAcc: acc + parseInt(num) };

    default:
      throw new Error('Unkown instruction');
  }
}

function execute({ instructions, visited, lastLine }) {
  // const visited = new Set();
  // let lastExecutedLine = -1;

  let currentLine = 0;
  let acc = 0;

  while (!visited.has(currentLine) || currentLine >= instructions.length) {
    lastLine = currentLine;
    visited.add(currentLine);

    const instruction = instructions[currentLine];
    const { nextLine, nextAcc } = step({ line: currentLine, instruction, acc });

    currentLine = nextLine;
    acc = nextAcc;
  }

  return { acc, lastLine, visited };
}

function fixIntructions(instructions) {
  const { acc, lastLine } = execute({
    instructions,
    visited: new Set(),
    lastLine: -1,
  });

  const lastInstruction = instructions[lastLine];
  let [cmd, num] = lastInstruction.split(' ');

  switch (cmd) {
    case 'nop':
      cmd = 'jmp';
      break;
    case 'jmp':
      cmd = 'nop';
      break;
    default:
      throw new Error('Unkown instruction');
  }

  const instructionsChanged = [...instructions];
  instructionsChanged[lastLine] = `${cmd} ${num}`;

  return execute({
    instructions: instructionsChanged,
    visited: new Set(),
    lastLine: -1,
  });
}

// function fixIntructions(instructions) {
//   const attempedLines = [];
//   let lastLine = -1;
//   let acc = null;
//   const visited = new Set();

//   ({ lastLine, acc } = execute(instructions, visited, lastLine));

//   while (lastLine !== fixIntructions.length - 1) {
//     const instructionsChanged = [...instructions];

//     const didFix = false

//     while(!didFix){
//       const lastInstruction = instructions[lastLine]

//       if(lastInstruction === 'jmp' || lastInstruction === 'nop'){

//       }
//     }

//     ;({ lastLine, acc } = execute(instructionsChanged, visited, lastLine));
//   }

//   return acc;
// }

const { acc } = fixIntructions(input);

console.log('end');
