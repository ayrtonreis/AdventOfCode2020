const fs = require('fs');

const input = fs
  .readFileSync('./input.txt', 'utf8')
  .split('\n')
  .map((line) => line.split(' '));

function passwordChecker1({ password, letter, param0, param1 }) {
  let count = 0;
  for (let l of password) {
    if (l === letter) count++;
  }
  return count >= param0 && count <= param1;
}

function passwordChecker2({ password, letter, param0, param1 }) {
  const cond0 = password[param0 - 1] === letter;
  const cond1 = password[param1 - 1] === letter;

  const xor = (cond0 || cond1) && !(cond0 && cond1);
  return xor;
}

function countAllowedPasswords(arr, validator) {
  return input.filter(([ruleBoundaries, ruleLetter, password]) => {
    const [param0, param1] = ruleBoundaries
      .split('-')
      .map((val) => parseInt(val));

    const letter = ruleLetter[0];

    return validator({ password, letter, param0, param1 });
  }).length;
}

let countAllowed = countAllowedPasswords(input, passwordChecker1);
console.log('N. passwords allowed in first policy: ', countAllowed);

countAllowed = countAllowedPasswords(input, passwordChecker2);
console.log('N. passwords allowed in second policy: ', countAllowed);
