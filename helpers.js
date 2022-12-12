import fs from 'fs';

// basic read of file from given day number
const readData = (day, file = 'data') => fs.readFileSync(`${__dirname}/${day}/${file}.txt`, 'utf8');

// split by line, strings
const toStrings = (day, file) => readData(day, file).split("\n");

// split by line, converted to numbers, empty line returns undefined
const toNumbers = (day, file) => toStrings(day, file).map(curr => curr === '' ? undefined : Number(curr));

// split into multidimensional grid
const toMultidimensional = (day, file) => toStrings(day, file).map(row => row.split(''));

// split into multidimensional grid, converted to numbers
const toMultidimensionalNumeric = (day, file) => toMultidimensional(day, file).map(curr => Number(curr));

export { readData, toStrings, toNumbers, toMultidimensional, toMultidimensionalNumeric };