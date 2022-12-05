import { toStrings } from '../helpers';

const day = '05';
const test = toStrings(day, 'test');
const data = toStrings(day, 'data');

const parseCrates = arr => {
    // get the chunk describing initial crate order
    const chunk = arr.slice(0, arr.indexOf('') - 1);
    // parse the plaintext format
    return chunk.reduceRight((out, row) => {
        let col = 0;
        for (let i = 1; i < row.length; i += 4) {
            if (row[i] !== ' ') out[col] = out[col] ? [...out[col], row[i]] : [row[i]];
            col++;
        }
        return out;
    }, []);
};

const parseInstructionRow = row => {
    const [_, times, __, from, ___, to] = row.split(' ');
    // return instructions, adjusting 'from' and 'to' to account for 0 index
    return { 
        times: Number(times), 
        from: Number(from) - 1, 
        to: Number(to) - 1
    };
}

const parseInstructions = arr => {
    // get the chunk describing instructions
    const chunk = arr.slice(arr.indexOf(''), arr.length);
    return chunk.reduce((out, row) => {
        const { from, to, times } = parseInstructionRow(row);
        let instructions = [];
        for (let i = 0; i< times; i++) instructions.push({from, to});
        return [...out, ...instructions];
    }, [])
};

// part 1

const crateMover = arr => {
    // parse the data
    const instructions = parseInstructions(arr);
    let crates = parseCrates(arr);
    // move the crates
    instructions.forEach(({ from, to }) => {
        const movingCrate = crates[from].pop();
        crates[to].push(movingCrate);
    });
    // return the top crate from each
    return crates.reduce((out, stack) => out += stack[stack.length - 1] || '', '');
}

// part 2

const parseInstructions9001 = arr => {
    // get the chunk describing instructions
    const chunk = arr.slice(arr.indexOf('') + 1, arr.length);
    // parse the rows, taking into account that multiple crates are moved in each operation
    return chunk.map(parseInstructionRow);
};

const crateMover9001 = arr => {
    // parse the data
    const instructions = parseInstructions9001(arr);
    let crates = parseCrates(arr);
    // move the crates
    instructions.forEach(({ from, to, times }) => {
        crates[to] = [...crates[to], ...crates[from].slice(-times)];
        crates[from] = crates[from].slice(0, crates[from].length - times);
    });
    // return the top crate from each
    return crates.reduce((out, stack) => out += stack[stack.length - 1] || '', '');
}

console.log(crateMover9001(test));
console.log(crateMover9001(data));