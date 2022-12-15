import { readData, toStrings } from '../helpers';

const day = '15';
const test = toStrings(day, 'test');
const data = toStrings(day, 'data');

// parsing and mapping
const getSensor = str => {
    const [x, y, bX, bY] = str.replace('Sensor at ', '').replace(': closest beacon is at', '').replaceAll(', ', ' ').split(' ').map(sub => Number(sub.split('=')[1]));
    const dist = (Math.max(x, bX) - Math.min(x, bX)) + (Math.max(y, bY) - Math.min(y, bY));
    const sensor = { x, y, bX, bY, dist };
    return sensor;
}

const getSensors = arr => arr.map(getSensor);

const getBounds = sensors => ({
    t: Math.min(...sensors.map(s => s.y - s.dist)),
    b: Math.max(...sensors.map(s => s.y + s.dist)),
    l: Math.min(...sensors.map(s => s.x - s.dist)),
    r: Math.max(...sensors.map(s => s.x + s.dist))
});

// render the grid, lifted from yesterday ;D
const renderMap = grid => grid.reduce((out, row) => out += `${row.map(num => Number.isInteger(num) ? '*' : '.').join('')}\n`, '');

// normalise coords to array keys
const n = (x, y, b) => ({ x: x - b.l, y: y - b.t });

// recursively cover the grid
const recursivePlot = (x, y, dist, steps, grid) => {
    // we've been here
    grid[y][x] = steps;
    if (steps === dist) return grid;
    // can we move?
    const moves = [{ x: x-1, y }, { x, y: y-1 }, { x: x+1, y }, { x, y: y+1 }];
    const actualMoves = moves.filter(next => !grid[next.y][next.x] || (steps+1) < grid[next.y][next.x]);
    actualMoves.forEach(next => { grid = recursivePlot(next.x, next.y, dist, steps+1, grid) });
    return grid;
}

// okay FINE, non-recursively cover the grid
const justPlot = (sX, sY, dist, grid) => {
    let width = (dist * 2) + 1; // the widest point;
    for (let i = 0; i <= dist; i++) {
        const downY = sY + i;
        const upY = sY - i;
        const offset = dist - i;
        for (let x = sX - offset; x <= sX + offset; x++) {
            grid[downY][x] = 1;
            grid[upY][x]= 1;
        }
    };
    return grid;
}

// get the sensors, bounds, and plot the map
const plotCoverage = arr => {
    console.log('getting sensors');
    const sensors = getSensors(arr);
    // get bounds and height
    console.log('getting bounds');
    const bounds = getBounds(sensors);
    const w = bounds.r - bounds.l;
    const h = bounds.b - bounds.t;
    // build the grid
    const baseRow = Array.apply(null, Array(w + 1)).fill(null);
    let grid = Array.apply(null, Array(h + 1)).fill(null).map(_ => [...baseRow]);
    // plot the sensor coverage
    console.log('plotting sensors');
    sensors.forEach((s, i) => {
        console.log(`plotting sensor ${i} of ${sensors.length}`);
        const nS = n(s.x, s.y, bounds);
        // grid = recursivePlot(nS.x, nS.y, s.dist, 0, grid);
        grid = justPlot(nS.x, nS.y, s.dist, grid);
    });
    // draw sensors / beacons
    sensors.forEach(s => {
        const sensor = n(s.x,  s.y,  bounds);
        const beacon = n(s.bX, s.bY, bounds);
        grid[sensor.y][sensor.x] = 'S';
        grid[beacon.y][beacon.x] = 'B';
    })
    return { grid, bounds };
};

// okay FIIIIIINE, just plot the target row :D
const justPlotRow = (s, b, cache, targetRow) => {
    // console.log(cache);
    for (let i = 0; i <= s.dist; i++) {
        const pos = n(s.x, s.y, b);
        const downY = pos.y + i;
        const upY = pos.y - i;
        const toDraw = downY === (targetRow - b.t)
            ? downY : upY === (targetRow - b.t)
                ? upY : null;
        if (toDraw) {
            const offset = s.dist - i;
            for (let x = pos.x - offset; x <= pos.x + offset; x++) {
                cache[x] = true;
            }
            return cache;
        }
    };
    return cache;
}

// okay let's do the same but only modelling the target row
const plotSingleRowCoverage = (arr, targetRow, withSensors = true) => {
    // console.log('getting sensors');
    const sensors = getSensors(arr);
    // get bounds and height
    // console.log('getting bounds');
    const bounds = getBounds(sensors);
    const w = bounds.r - bounds.l;
    // set up the row
    let cache = {};
    // plot the sensor coverage
    // console.log('plotting sensors');
    // filter the sensors, we only care about ones that might affect the target row
    const filteredSensors = sensors.filter(s => s.y - s.dist <= targetRow && s.y + s.dist >= targetRow);
    filteredSensors.forEach((s, i) => {
        // console.log(`plotting sensor ${i} of ${filteredSensors.length}`);
        // const nS = n(s.x, s.y, bounds);
        // grid = recursivePlot(nS.x, nS.y, s.dist, 0, grid);
        cache = justPlotRow(s, bounds, cache, targetRow);
    });
    // draw sensors / beacons
    if (withSensors) {
        sensors.forEach(s => {
            let pos = null;
            if (s.y === targetRow) pos = { x: s.x, y: s.y };
            if (s.bY === targetRow) pos = { x: s.bX, y: s.bY };;
            pos = pos ? n(pos.x, pos.y, bounds) : null;
            if (pos) delete(cache[pos.x]);
        })
    }
    return { cache, bounds, w };
};

// part 1
const getPositions = (arr, y) => {
    const { grid, bounds } = plotCoverage(arr, y);
    const nY = y - bounds.t;
    console.log(renderMap(grid))
    // console.log(grid[nY].map(pos => Number.isInteger(pos) ? '*' : '.').join(''));
    return grid[nY].filter(pos => Number.isInteger(pos)).length;
}

const getRow = (arr, targetRow) => {
    const { cache, w } = plotSingleRowCoverage(arr, targetRow);
    return Object.keys(cache).length;
}

// part 2
const findGap = (arr, max) => {
    for (let i=0; i<=max; i++) {
        const { cache, bounds, w } = plotSingleRowCoverage(arr, i, false);
        const posKeys = Object.keys(cache)//.filter(key => key >= 0 && key <= max);
        let out = '';
        for(let x=0 - bounds.l; x <= max-bounds.l; x++) {
            out += posKeys.includes('' + x) ? 'X' : '.';
        };
        console.log(out);
    }
}

const testRender  = () => {
    const { grid } = plotCoverage(test);
    const toCompare = readData(day, 'testRender');
    const render = renderMap(grid);
    console.log(render);
    console.log(toCompare);
    render === toCompare
        ? console.log("Test PASS!")
        : console.error("Test FAIL");
};

console.log(getRow(test, 10));
// console.log(getRow(data, 2000000));

console.log(findGap(test, 20));
// console.log(findGap(data, 4000000));