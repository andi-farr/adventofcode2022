import { toStrings } from '../helpers';

const day = '10';
const test = toStrings(day, 'test');
const data = toStrings(day, 'data');

// instruction processing
const parseInstructions = arr => arr.reduce((out, inst) => [...out, ...(inst === 'noop'
    ? [{ inst: 'noop' }]
    : [{ inst: 'beginAdd' }, { inst: 'add', value: Number(inst.split(' ')[1])}]
)], []);

const calculateSignals = arr => parseInstructions(arr)
    .reduce((out, inst) => [...out, out[out.length-1] + (inst.inst === 'add' ? inst.value : 0)], [1])
    .slice(0, 240);

// part 1
const specialTicks = [20, 60, 100, 140, 180, 220];

const sumSpecialSignals = arr => {
    const signals = calculateSignals(arr);
    const specialSignals = specialTicks.map(i => i * signals[i-1]);
    return specialSignals.reduce((sum, sig) => sum + sig, 0);
}

// part 2
const toDisplay = (output, h) => {
    const w = output.length / h;
    const rows = Array.apply(null, Array(h)).fill(null);
    return rows.map((_, offset) => output.slice(offset * w, (offset * w) + w).join('')).join('\n');
}

const renderDisplay = arr => {
    const signals = calculateSignals(arr);
    const w = 40;   // display width
    const h = 6     // display height
    // work out whether the pixel is lit
    const output = signals.map((sig, i) => {
        const tick = i % w;
        return (tick === sig || tick === sig -1 || tick === sig +1) ? '◉' : ' ';
    });
    return toDisplay(output, h);
}

console.log(renderDisplay(data));