import { toMultidimensional } from '../helpers';

const day = '12';
const test = toMultidimensional(day, 'test');
const data = toMultidimensional(day, 'data');

// traversal helpers
// get the 'S' and 'E' positions from an input grid
const getStartAndEnd = grid => grid.reduce((out, row, y) => row.reduce((rowOut, pos, x) => (
    pos === 'S' ? { ...rowOut, start: { x, y }} : pos === 'E' ? { ...rowOut, end: { x, y }} : rowOut 
), out), {});

// get any potential starting points for the hiking trail ('a' or 's')
const getStarts = grid => grid.reduce(
    (out, row, y) => [...out, ...row.reduce(
        (rowOut, pos, x) => ((pos === 'S' || pos === 'a') ? [...rowOut, { x, y }] : rowOut), 
    [])], []);

// create an empty version of the grid to store best step 'scores' in to avoid mapping longer routes
const initBestStepsMap = grid => grid.map(row => row.map(_ => 'X'));

// get a numeric value for a provided pos (including start / end characters)
const posToHeight = pos => pos === 'S' ? 1 : pos === 'E' ? 26 : pos.charCodeAt(0) - 96;

// four directions to consider for each step
const baseOptions = (x, y) => [
    { x: x-1, y: y, t: 'L'}, { x: x+1, y: y, t: 'R' }, 
    { x: x, y: y-1, t: 'U'}, { x: x, y: y+1, t: 'D'}
];

// from a given point, identify valid moves and then recurse through them
const recursivelyStep = (x, y, steps, grid, best, solutions = []) => {
    // log best steps
    best[y][x] = steps;
    // have we reached the end?
    if (grid[y][x] === 'E') {
        return [...solutions, steps];
    }
    // check options
    const pos = grid[y][x];
    const posHeight = posToHeight(pos);
    const options = baseOptions(x, y).filter(opt => {
        const newPos = grid[opt.y] && grid[opt.y][opt.x];
        return newPos &&                                                    // position exists
            posToHeight(newPos) <= posHeight + 1 &&                         // position height is valid
            (best[opt.y][opt.x] === 'X' || steps+1 < best[opt.y][opt.x])    // position hasn't been reached in less steps
    });
    // recurse
    options.forEach(opt => {
        solutions = recursivelyStep(opt.x, opt.y, steps+1, grid, best, solutions);
    });
    return solutions;
}

// part 1
const findBestPath = grid => {
    const { start } = getStartAndEnd(grid);
    let best = initBestStepsMap(grid);
    const solutions = recursivelyStep(start.x, start.y, 0, grid, best);
    return solutions.reduce((out, solution) => solution < out ? solution : out, Infinity);
}

// part 2
const findHikingTrail = grid => {
    const starts = getStarts(grid);
    const trails = starts.map(start => 
        recursivelyStep(start.x, start.y, 0, grid, initBestStepsMap(grid))
            .reduce((out, solution) => solution < out ? solution : out, Infinity));

    return trails.reduce((out, solution) => solution < out ? solution : out, Infinity);
}

console.log(findHikingTrail(data));