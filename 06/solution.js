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

const findMarkerCondensed = (str, mL = 4) => 
    str.split('').reduce((out, _, i) => (out || (new Set(str.slice(i-mL, i).split('')).size === mL ? i :  null)), null);

console.log(findMarkerCondensed(test, 4));
console.log(findMarkerCondensed(data, 4));
console.log(findMarkerCondensed(test, 14));
console.log(findMarkerCondensed(data, 14));