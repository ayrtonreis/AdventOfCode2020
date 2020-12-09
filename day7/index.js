const fs = require('fs');

function buildRules(str) {
  str = str.replace(/bags|bag|\./g, '');
  const pieces = str.split('contain');
  const mainColor = pieces[0].trim();

  const contains = pieces[1].split(',').map((s) => {
    const number = s.match(/\d+/);

    if (number) {
      const color = s.replace(/\d+/, '').trim();
      return { [color]: number };
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
// light red bags contain 1 bright white bag, 2 muted yellow bags.
// dark orange bags contain 3 bright white bags, 4 muted yellow bags.
// bright white bags contain 1 shiny gold bag.
// muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
// shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
// dark olive bags contain 3 faded blue bags, 4 dotted black bags.
// vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
// faded blue bags contain no other bags.
// dotted black bags contain no other bags.
//   `
//   .trim()
//   .split('\n')
//   .map(buildRules);

const inputMap = input.reduce((acc, curr) => ({ ...acc, ...curr }), {});

const memResults = new Map();

function searchForBag(visited, currentKey, contains, targetColor) {
  if (memResults.has(currentKey)) return memResults.get(currentKey);

  visited.add(currentKey);

  const entries = Object.entries(contains);

  for (let [color, num] of entries) {
    if (color === targetColor && num > 0) {
      memResults.set(currentKey, true);
      return true;
    }

    if (!visited.has(color)) {
      const searchInner = searchForBag(
        visited,
        color,
        inputMap[color],
        targetColor
      );

      if (searchInner) return true;
    }
  }

  memResults.set(currentKey, false);
  return false;
}

const positive = input.filter((element) => {
  const [color, contains] = Object.entries(element)[0];
  return searchForBag(new Set(), color, contains, 'shiny gold');
});
const num = positive.length;

console.log({ num });

console.log('end');
