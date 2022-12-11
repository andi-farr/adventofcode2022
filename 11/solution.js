import { readData } from '../helpers';

const day = '11';
const test = readData(day, 'test');
const data = readData(day, 'data');

// parse txt file
const parseMonkeys = txt => {
    const chunks = txt.split('\n\n')
    const monkeys = chunks.map(chunk => {
        const rows = chunk.split('\n');
        const output = {
            items: rows[1].replace('Starting items: ', '').split(', ').map(item => Number(item)),
            divBy: Number(rows[3].replace('  Test: divisible by ', '')),
            passTo: {
                t: Number(rows[4].replace('    If true: throw to monkey ', '')),
                f: Number(rows[5].replace('    If false: throw to monkey ', ''))
            },
            op: {
                operator: rows[2].split(' ')[6],
                by: Number(rows[2].split(' ')[7]) || null
            },
            inspected: 0
        }
        return output;
    })
    return monkeys;
}

const getMaxSize = monkeys => monkeys.reduce((out, monkey) => out * monkey.divBy, 1);

const shenanigans = (txt, rounds=20, relief) => {
    let monkeys = parseMonkeys(txt);
    const maxSize = getMaxSize(monkeys);
    // game loop
    for (let round=1; round<=rounds; round++) {
        monkeys.forEach(monkey => {
            monkey.items.forEach(item => {
                const by = monkey.op.by || item;
                const newItem = relief // this could be nicer but it's clear what's happening
                    ? Math.floor((monkey.op.operator === '+' ? item + by : item * by) / relief)
                    : monkey.op.operator === '+' ? item + by : item * by;
                const passTo = newItem % monkey.divBy ? monkey.passTo.f : monkey.passTo.t;
                // after the maxSize the remainder will work fine as item size
                monkeys[passTo].items.push(newItem % maxSize);
                monkey.inspected++;
            });
            monkey['items'] = [];
        });
    }
    return monkeys;
}

const getMonkeyBusiness = (txt, rounds=20, relief, top=2) =>
    shenanigans(txt, rounds, relief)
        .sort((a, b) => b.inspected - a.inspected)
        .slice(0, top)
        .reduce((total, current) => total * current.inspected, 1);

console.log(getMonkeyBusiness(test, 20, 3));
console.log(getMonkeyBusiness(data, 20, 3));
console.log(getMonkeyBusiness(test, 10000));
console.log(getMonkeyBusiness(data, 10000));