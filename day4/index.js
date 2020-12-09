const fs = require('fs');

const input = fs
  .readFileSync('./input.txt', 'utf8')
  .split('\n\n')
  .map((item) =>
    item.split(/\s+/).reduce((acc, curr) => {
      const [key, value] = curr.split(':');
      acc[key] = value;
      return acc;
    }, {})
  );
// .map((line) => line.split(''));

/**
 *
 * @param {Object} obj
 * @param {String[]} mandatoryFields
 */
const validator = (obj, mandatoryFields) => {
  for (let field of mandatoryFields) {
    if (obj[field] === undefined) return false;
  }
  return true;
};

const mandatoryFields = [
  'byr',
  'iyr',
  'eyr',
  'hgt',
  'hcl',
  'ecl',
  'pid',
  // 'cid',
];

let countValid = input.filter((obj) => validator(obj, mandatoryFields)).length;

console.log({ countValid });
const colorSet = new Set(['amb', , 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']);

const rules = [
  {
    key: 'byr',
    rule: (val) => {
      if (val.length !== 4) return false;
      const year = parseInt(val);
      return year >= 1920 && year <= 2002;
    },
  },
  {
    key: 'iyr',
    rule: (val) => {
      if (val.length !== 4) return false;
      const year = parseInt(val);
      return year >= 2010 && year <= 2020;
    },
  },
  {
    key: 'eyr',
    rule: (val) => {
      if (val.length !== 4) return false;
      const year = parseInt(val);
      return year >= 2020 && year <= 2030;
    },
  },
  {
    key: 'hgt',
    rule: (val) => {
      if (val.indexOf('cm') !== -1) {
        const h = parseInt(val.substring(0, val.indexOf('cm')));
        return h >= 150 && h <= 193;
      }

      if (val.indexOf('in') !== -1) {
        const num = val.substring(0, val.indexOf('in'));
        const h = parseInt(num);
        return h >= 59 && h <= 76;
      }

      return false;
    },
  },
  {
    key: 'hcl',
    rule: (val) => {
      if (val[0] !== '#' || val.length !== 7) return false;
      return /^[0-9a-f]+$/.test(val.substring(1));
    },
  },
  {
    key: 'ecl',
    rule: (val) => {
      return colorSet.has(val);
    },
  },
  {
    key: 'pid',
    rule: (val) => {
      if (val.length !== 9) return false;
      return /^\d+$/.test(val);
    },
  },
  // 'cid',
];

const complexValidator = (obj) => {
  for (let { key, rule } of rules) {
    const val = obj[key];
    if (val === undefined) return false;

    const isValid = rule(val);
    // if (!isValid) debugger;
    if (!isValid) return false;
  }

  return true;
};

const testInput = 'pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980 hcl:#623a2f'
  .split('\n\n')
  .map((item) =>
    item.split(/\s+/).reduce((acc, curr) => {
      const [key, value] = curr.split(':');
      acc[key] = value;
      return acc;
    }, {})
  );

countValid = input.filter((obj) => complexValidator(obj, rules)).length;

console.log({ countValid });

console.log(input);
