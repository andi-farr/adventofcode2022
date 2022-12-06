import { readData } from '../helpers';

const day = '06';
const test = readData(day, 'test');
const data = readData(day, 'data');

const findMarker = (str, markerLength = 4) => {
    for (let i = markerLength; i < str.length; i++) {
        const chunk = str.slice(i-markerLength, i);     // grab the next potential marker
        const chunkSet = new Set(chunk.split(''));      // create a Set of unique characters
        if (chunkSet.size === markerLength) return i;   // return if there were no repeats!
    }
};

console.log(findMarker(test, 4));
console.log(findMarker(data, 4));
console.log(findMarker(test, 14));
console.log(findMarker(data, 14));