const fs = require('fs');

const input = fs
  .readFileSync('./input.txt', 'utf8')
  .split('\n')
  .map((line) => line.split(''));

const createStepper = (deltaX, deltaY) => (matrix, x, y) => {
  let [newX, newY] = [x + deltaX, y + deltaY];

  if (newY >= matrix.length) return [newX, newY];

  const rowLength = matrix[newY].length;
  if (newX >= rowLength) {
    newX -= rowLength;
  }

  return [newX, newY];
};

function checker(matrix, x, y) {
  return matrix[y][x] === '#';
}

/**
 *
 * @param {number[][]} matrix
 * @param {function(): number[]} stepper
 * @param {function(): boolean} checker
 */
function countMapObstacles(matrix, stepper, checker) {
  let [x, y] = [0, 0];
  let count = 0;
  for (let row of matrix) {
    [x, y] = stepper(matrix, x, y);

    if (y < matrix.length && x < matrix[y].length && checker(matrix, x, y)) {
      count++;
    }
  }

  return count;
}

const numTrees = countMapObstacles(input, createStepper(3, 1), checker);
console.log({ numTrees });

function countObstaclesForSlopes(slopes) {
  const obstacles = slopes.map((slope) =>
    countMapObstacles(input, createStepper(...slope), checker)
  );

  return obstacles;
}

const obstaclesForScenarios = countObstaclesForSlopes([
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
]);

const productOfObstacles = obstaclesForScenarios.reduce(
  (acc, val) => acc * val,
  1
);

console.log({ productOfObstacles });
