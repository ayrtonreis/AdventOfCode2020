const fs = require('fs');

const input = fs
  .readFileSync('./input.txt', 'utf8')
  .split('\n')
  .map((val) => parseInt(val));

function findSumPairBruteForce(arr, sum) {
  for (let i = 0; i < arr.length; i++) {
    const first = arr[i];

    for (let j = i + 1; j < arr.length; j++) {
      const second = arr[j];

      if (first + second === sum) return [first, second];
    }
  }

  throw new Error(
    `There is no pair of numbers in the input array which sums to ${sum}`
  );
}

const [a, b] = findSumPairBruteForce(input, 2020);
const firstProduct = a * b;
console.log({ firstProduct });

function findSumTripleBruteForce(arr, sum) {
  for (let i = 0; i < arr.length; i++) {
    const first = arr[i];

    if (first >= sum) continue;

    for (let j = i + 1; j < arr.length; j++) {
      const second = arr[j];

      if (first + second >= sum) continue;

      for (let k = j + 1; k < arr.length; k++) {
        const third = arr[k];
        if (first + second + third === sum) return [first, second, third];
      }
    }
  }

  throw new Error(
    `There is no pair of numbers in the input array which sums to ${sum}`
  );
}
console.log('start');
const triple = findSumTripleBruteForce(input, 2020);
console.log('end');
const secondProduct = triple.reduce((acc, curr) => acc * curr, 1);
console.log({ secondProduct });
