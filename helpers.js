import fs from 'fs';

// split by line, strings
const getData = filename => fs.readFileSync(filename, 'utf8').split("\n");

// split by line, converted to numbers, empty line returns undefined
const getDataToNumbers = filename => getData(filename).map(curr => curr === '' ? undefined : Number(curr));

export { getData, getDataToNumbers };