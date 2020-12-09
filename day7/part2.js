const fs = require('fs');

function buildRules(str) {
  str = str.replace(/bags|bag|\./g, '');
  const pieces = str.split('contain');
  const mainColor = pieces[0].trim();

  const contains = pieces[1].split(',').map((s) => {
    const number = s.match(/\d+/);

    if (number) {
      const color = s.replace(/\d+/, '').trim();
      return { [color]: parseFloat(number) };
    }

    return {};
  });

  return {
    [mainColor]: contains.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
  };
}

const res1 = buildRules(
  'light red bags contain 1 bright white bag, 2 muted yellow bags.'
);

const res2 = buildRules('faded blue bags contain no other bags.');

const input = fs
  .readFileSync('./input.txt', 'utf8')
  .trim()
  .split('\n')
  .map(buildRules);

// const input = `
// shiny gold bags contain 2 dark red bags.
// dark red bags contain 2 dark orange bags.
// dark orange bags contain 2 dark yellow bags.
// dark yellow bags contain 2 dark green bags.
// dark green bags contain 2 dark blue bags.
// dark blue bags contain 2 dark violet bags.
// dark violet bags contain no other bags.
//   `
//   .trim()
//   .split('\n')
//   .map(buildRules);

const inputMap = input.reduce((acc, curr) => ({ ...acc, ...curr }), {});

const memResults = new Map();

// function searchForBag(visited, currentKey, targetColor) {
//   if (memResults.has(currentKey)) return memResults.get(currentKey);

//   visited.add(currentKey);

//   const entries = Object.entries(inputMap[currentKey]);

//   for (let [color, num] of entries) {
//     if (color === targetColor && num > 0) {
//       memResults.set(currentKey, true);
//       return true;
//     }

//     if (!visited.has(color)) {
//       const searchInner = searchForBag(visited, color, targetColor);

//       if (searchInner) return true;
//     }
//   }

//   memResults.set(currentKey, false);
//   return false;
// }

function countTotalBags(currentKey) {
  if (memResults.has(currentKey)) return memResults.get(currentKey);

  const entries = Object.entries(inputMap[currentKey]);

  let sum = 0;

  for (let [color, num] of entries) {
    sum += num;
    sum += num * countTotalBags(color);
  }

  memResults.set(currentKey, sum);
  return sum;
}

const num = countTotalBags('shiny gold');

console.log({ num });

console.log('end');
