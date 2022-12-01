import { toNumbers } from '../helpers';

const test = toNumbers('01', 'test');
const data = toNumbers('01', 'data');

// create an array of elves, showing total calories for each
const toElves = arr => arr.reduce(
    (agg, current) => (current === undefined
        ? [...agg, 0] // new elf
        : [...agg.slice(0, -1), agg[agg.length -1] + current] // add calories to current elf
    ), [0]
);

// get the elf with the highest total calories
const bestElf = arr => {
    const elves = toElves(arr);
    return elves.sort((a, b) => b - a)[0];
};

// get the top three elves by total calories, return the sum of calories
const bestThree = arr => {
    const elves = toElves(arr);
    return elves.sort((a, b) => b - a).slice(0, 3).reduce(
        (total, current) => (total + current), 0
    );
}

console.log(bestElf(data));
console.log(bestThree(data));