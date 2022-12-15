import { toStrings } from '../helpers';

const day = '14';
const test = toStrings(day, 'test');
const data = toStrings(day, 'data');

const toCoords = str => {
    const [x, y] = str.split(',');
    return { x: Number(x), y: Number(y) }
};

const getRockPositions = arr => {
    const formations = arr.map(row => row.split(' -> '));
    // list all points which are rock
    return formations.map(form => form.reduce((out, point, i) => {
        if (!i) return [toCoords(point)];
        // get coords
        const p1 = toCoords(point);
        const p2 = toCoords(form[i-1]);
        // get points inbetween
        const axis = p1.x === p2.x ? 'y' : 'x';
        const perp = axis === 'x' ? 'y' : 'x';
        const start = Math.min(p1[axis], p2[axis]);
        const end = Math.max(p1[axis], p2[axis]);
        // draw the rocks
        let points = [p1];
        if (start === end - 1) return [...out, ...points];
        for (let ii = start + 1; ii < end; ii++) {
            points.push({ [axis]: ii, [perp]: p1[perp] })
        }
        return [...out, ...points];
    }, []));
};

const getBounds = rockFormations => {
    const flatX = rockFormations.reduce((out, form) => [...out, ...form.map(({x}) => x)], []);
    const flatY = rockFormations.reduce((out, form) => [...out, ...form.map(({y}) => y)], []);
    return { l: Math.min(...flatX), r: Math.max(...flatX), b: Math.max(...flatY) };
}

// render the grid, mostly for debugging and general niceness
const renderMap = grid => grid.reduce((out, row) => out += `${row.map(char => char || '.').join('')}\n`, '');

// generate a starting map / bounds from the original input (and add padding if we need it)
const generateMap = (arr, pad) => {
    const rockFormations = getRockPositions(arr);
    const rocks = rockFormations.reduce((out, form) => [...out, ...form], []);
    // get bounds (and pad if we need to)
    const bounds = getBounds(rockFormations);
    if (pad) {
        bounds.l -= pad;
        bounds.r += pad;
    }
    // create the map grid
    const baseRow = Array.apply(null, Array(bounds.r - bounds.l + 1)).fill(null);
    const grid = Array.apply(null, Array(bounds.b + 1)).fill(null).map(_ => [...baseRow]);
    rocks.forEach(rock => grid[rock.y][rock.x - bounds.l] = '#');
    return { grid, bounds };
}

// simulate the sand drop
const n = (x, b) => x - b.l; // a small utility to normalise the x coordinate to the grid's x index

const dropSand = (x, y, grid, b) => {
    let settled = false;
    while(!settled) {
        // if we're on the bottom row we are definitely falled off
        if (y === b.b) return { grid, done: true };
        // get possible next moves
        const nextMove = [{x, y: y+1}, {x: x-1, y: y+1}, {x: x+1, y: y+1}].filter(move => grid[move.y] && !grid[move.y][move.x])[0];
        // have we gone out of bounds?
        if (nextMove && (nextMove.x < n(b.l, b) || nextMove.x > n(b.r, b))) return { grid, done: true }
        // we're either settled or we're still falling
        if (!nextMove) {
            // we're settled
            grid[y][x] = 'o';
            settled = true;
            return { grid, done: false };
        }
        x = nextMove.x; y = nextMove.y;
    }
    console.error('dropSand: failed');
}

// part 1
const simulate = (arr) => {
    let { grid, bounds } = generateMap(arr);
    // if we have a floor, simulate that
    
    const dropX = n(500, bounds);
    // okay let's drop some sand
    let done = false;
    let count = -1;
    while (!done) {
        count ++;
        const result = dropSand(dropX, 0, grid, bounds);
        done = result.done;
        grid = result.grid;
    };
    console.log(renderMap(grid));
    return count;
}

// part 2 (I usually refactor the helpers but it was nearly midnight, sue me)
const dropSandUntilFull = (x, y, grid, b) => {
    let settled = false;
    while(!settled) {
        // get possible next moves
        const nextMove = [{x, y: y+1}, {x: x-1, y: y+1}, {x: x+1, y: y+1}].filter(move => grid[move.y] && !grid[move.y][move.x])[0];
        // we're either settled or we're still falling
        if (!nextMove) {
            // we're settled
            grid[y][x] = 'o';
            settled = true;
            // are we full?
            if (x === n(500, b) && y === 0) {
                return { grid, done: true };
            }
            return { grid, done: false };
        }
        x = nextMove.x; y = nextMove.y;
    }
    console.error('dropSand: failed');
}

const simulateWithFloor = (arr) => {
    let { grid, bounds } = generateMap(arr, 160); // trial and error padding, to avoid adding to the grid dynamically ;D
    // add the floor
    bounds.b += 2;
    grid = [...grid, grid[0].map(_ => null), grid[0].map(_ => '#')];
    const dropX = n(500, bounds);
    // okay let's drop a whole big pile of sand,
    let done = false;
    let count = 0;
    while (!done) {
        count ++;
        const result = dropSandUntilFull(dropX, 0, grid, bounds);
        done = result.done;
        grid = result.grid;
    };
    console.log(renderMap(grid));
    return count;
}

console.log(simulate(data));
console.log(simulateWithFloor(data));