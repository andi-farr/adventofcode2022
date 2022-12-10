import { toStrings } from '../helpers';

const day = '09';
const test = toStrings(day, 'test');
const test2 = toStrings(day, 'test2');
const data = toStrings(day, 'data');

const toSteps = arr => arr.reduce((out, str) => {
    const [dir, steps] = str.split(' ');
    const axis = dir === 'L' || dir === 'R' ? 'x' : 'y';    // set the axis the head will move on
    const move = dir === 'L' || dir === 'D' ? -1 : 1;       // set the move the head will make
    const inst = { axis, move }                             // a single step instruction
    const instructions = Array.apply(null, Array(Number(steps))).fill(inst);
    return [...out, ...instructions];
}, []);

const oppAxis = axis => axis === 'x' ? 'y' : 'x';

// part 1
const findTailPath = arr => {
    // get instructions
    const steps = toSteps(arr);
    // initialise starting positions
    const head = { x: 0, y: 0 };
    const tail = { x: 0, y: 0 };
    // initialise tail position logging
    const tailPos = t => `${t.x}-${t.y}`;
    const tailMoves = [tailPos(tail)];
    // walk the path
    steps.forEach(inst => {
        const opp = oppAxis(inst.axis);
        // move the head
        head[inst.axis] += inst.move;
        // resolve the tail position
        if (Math.abs(head[inst.axis] -tail[inst.axis]) === 2) {
            tail[inst.axis] += inst.move;
            tail[opp] = head[opp]; // forces a diagonal move if necessary
            tailMoves.push(tailPos(tail));
        }
        console.log(`Head: ${tailPos(head)} / Tail: ${tailPos(tail)}`)
    });
    return new Set(tailMoves).size;
}

// part 2
const findLongTailPath = arr => {
     // get instructions
     const steps = toSteps(arr);
     // initialise starting positions
     const head = { x: 0, y: 0 };
     const tails = Array.apply(null, Array(9)).map(_ => ({ x: 0, y: 0 }))
     // initialise tail position logging
    const tailPos = t => `${t.x}-${t.y}`;
    const tailMoves = [tailPos(tails[8])];
     // walk the path
    steps.forEach(inst => {
        const opp = oppAxis(inst.axis);
        // move the head
        head[inst.axis] += inst.move;
        // resolve the tail positions
        tails.forEach((tail, i) => {
            const parent = i === 0 ? head : tails[i-1];
            // this could be refactored down BUT it is 1AM and no
            if (Math.abs(parent.x - tail.x) === 2 && Math.abs(parent.y - tail.y) === 2) {
                // catch the case where the parent knot has moved diagonally
                tail.x += tail.x < parent.x ? 1 : -1;
                tail.y += tail.y < parent.y ? 1 : -1;
                if (i === 8) tailMoves.push(tailPos(tail));
            } else if (Math.abs(parent[inst.axis] - tail[inst.axis]) === 2) {
                tail[inst.axis] += tail[inst.axis] < parent[inst.axis] ? 1 : -1;
                tail[opp] = parent[opp]; // forces a diagonal move if necessary
                if (i === 8) tailMoves.push(tailPos(tail));
            } else if (Math.abs(parent[opp] - tail[opp]) === 2) {
                tail[opp] += tail[opp] < parent[opp] ? 1 : -1;
                tail[inst.axis] = parent[inst.axis]; // forces a diagonal move if necessary
                if (i === 8) tailMoves.push(tailPos(tail));
            }
        })
    });
    return new Set(tailMoves).size;
}

console.log(findLongTailPath(data));