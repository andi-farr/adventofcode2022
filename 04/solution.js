import { toStrings } from '../helpers';

const day = '04';
const test = toStrings(day, 'test');
const data = toStrings(day, 'data');

const toPairs = arr => arr.map(pair => pair.split(',').map(range => {
    const [min, max] = range.split('-');
    return { min: Number(min), max: Number(max) }
}));

// part 1

const rangeIsSubset = (r1, r2) => (r1.min <= r2.min && r1.max >= r2.max);

const findCompleteOverlaps = arr => toPairs(arr).reduce((total, pair) => (
    total += (rangeIsSubset(pair[0], pair[1]) || rangeIsSubset(pair[1], pair[0])) ? 1 : 0
), 0);

// part 2

const rangeOverlaps = (r1, r2) => (r1.min <= r2.min) && (r1.max >= r2.min);

const findPartialOverlaps = arr => toPairs(arr).reduce((total, pair) => (
    total += (
        rangeOverlaps(pair[0], pair[1]) || rangeOverlaps(pair[1], pair[0]) ||
        rangeIsSubset(pair[0], pair[1]) || rangeIsSubset(pair[1], pair[0])
    ) ? 1 : 0
), 0);

console.log(findCompleteOverlaps(test));
console.log(findCompleteOverlaps(data));
console.log(findPartialOverlaps(test));
console.log(findPartialOverlaps(data));