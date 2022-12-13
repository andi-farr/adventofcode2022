import { readData } from '../helpers';

const day = '13';
const test = readData(day, 'test');
const data = readData(day, 'data');

const solvePair = ({ l, r }, top = true) => {
    // first, check for empty left array (this is a pass)
    if (!l.length && r.length) return true;
    // loop through the left and compare
    let i = 0;
    for (const lVal of l) {
        const rVal = r[i];
        if (Number.isInteger(lVal) && Number.isInteger(rVal)) {
            // if they're both integers, we either solve or move onto the next value
            if (lVal < rVal) return true;
            if (lVal > rVal) return false;
        } else if (rVal === undefined) {
            // right array ran out, this fails
            return false;
        } else {
            // at least one of these is an array
            const subArrays = {
                l: Number.isInteger(lVal) ? [lVal] : lVal,
                r: Number.isInteger(rVal) ? [rVal] : rVal
             }
            // then recurse through the subarrays
            const recurse = solvePair(subArrays, false);
            // if this actually returned then we've got our answer
            if (typeof recurse === 'boolean') return recurse;
            if (subArrays.l.length < subArrays.r.length) return true;
        }
        // otherwise this is unresolved, carry on
        i++;
    }
    if (top) return true; // we ran out of items on the left
};

// part 1
const parseData = txt => txt.split('\n\n').map(chunk => {
    const [l, r] = chunk.split('\n');
    return { l: JSON.parse(l), r: JSON.parse(r) };
});

const solveAll = txt => parseData(txt).reduce((out, pair, i) => solvePair(pair) ? out + (i+1) : out, 0);

// part 2
const dividers = ['[[2]]', '[[6]]'];
const getPackets = txt => [...dividers, ...txt.split(`\n`).filter(row => row !== '')].map(row => JSON.parse(row));

// convert the solve function into a sort function 
const packetSort = (a, b) => solvePair({ l: a, r: b }) ? -1 : 1;

const resolvePackets = txt => {
    const sortedPackets = getPackets(txt).sort(packetSort);
    const strPackets = sortedPackets.map(arr => JSON.stringify(arr));
    return strPackets.reduce((out, current, i) => dividers.includes(current) ? out * (i+1) : out, 1);
}

console.log(resolvePackets(test));
console.log(resolvePackets(data));