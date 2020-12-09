const fs = require('fs');

const input = fs
  .readFileSync('./input.txt', 'utf8')
  .trim()
  .split('\n\n')
  .map((item) => item.split('\n'));

// const input = `
// abc

// a
// b
// c

// ab
// ac

// a
// a
// a
// a

// b
// `
// .trim()
// .split('\n\n')
// .map((item) => item.split('\n'));

function countUnique(arr) {
  const set = new Set(arr);
  return set.size;
}

const inputConcatenated = input.map((item) => {
  const union = item.reduce((acc, curr) => acc + curr, '');
  return union;
});

const sumsUnion = inputConcatenated.map((item) => countUnique(item.split('')));

const totalSumUnion = sumsUnion.reduce((acc, curr) => acc + curr, 0);

console.log({ totalSumUnion });

function countIntersection(items) {
  const intersection = items.reduce((acc, curr) => {
    const set = new Set(curr.split(''));

    return acc.filter((letter) => set.has(letter));
  }, items[0].split(''));

  return intersection.length;
}

const sumsIntersection = input.map(countIntersection);
const totalSumIntersection = sumsIntersection.reduce(
  (acc, curr) => acc + curr,
  0
);

console.log({ totalSumIntersection });

console.log('end');
