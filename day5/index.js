const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8').split('\n');

function getNumber(str, trueChar) {
  let bin = 0b0;
  // str = str.split('').reverse().join('');

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === trueChar) {
      bin += 1;
    }
    if (i < str.length - 1) {
      bin = bin << 1;
    }
  }

  return bin;
}

function extractStrings(str) {
  const arr = str.split('');
  return {
    row: arr.slice(0, 7).join(''),
    col: arr.slice(7, arr.length).join(''),
  };
}

function calcRowCol({ row, col }, strCol) {
  return {
    row: getNumber(row, 'B'),
    col: getNumber(col, 'R'),
  };
}

function calcId(str) {
  const rowCol = extractStrings(str);
  const { row, col } = calcRowCol(rowCol);
  return row * 8 + col;
}

function test(str) {
  return {
    str,
    representation: extractStrings(str),
    calcRowCol: calcRowCol(extractStrings(str)),
    id: calcId(str),
  };
}
// let a = test('BFFFBBFRRR');
// let b = test('FFFBBBFRRR');
// let c = test('BBFFBBFRLL');

const ids = input.map((item) => calcId(item));
const max = ids.reduce((acc, curr) => {
  return Math.max(acc, curr);
}, 0);

// console.log();

function findUnusedIds(usedIds, min, max) {
  const unusedIds = new Set([]);

  for (let i = min; i < max; i++) {
    if (!usedIds.has(i)) unusedIds.add(i);
  }

  return unusedIds;
}

function findMySeat() {
  const usedSeats = new Set(ids);

  const unuseadIds = findUnusedIds(
    usedSeats,
    Math.pow(2, 3),
    Math.pow(2, 7) * 8 - 1
  );

  const possibleIds = [];

  Array.from(unuseadIds).forEach((id) => {
    if (usedSeats.has(id - 1) && usedSeats.has(id + 1)) {
      possibleIds.push(id);
    }
  });

  return possibleIds;
}

const unuseadIds = findUnusedIds(
  new Set(ids),
  Math.pow(2, 3),
  Math.pow(2, 7) * 8 - 1
);

const possibleIds = findMySeat();

console.log();
