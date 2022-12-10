import { toMultidimensionalNumeric } from '../helpers';

const day = '08';
const test = toMultidimensionalNumeric(day, 'test');
const data = toMultidimensionalNumeric(day, 'data');

// helpers
const getColumn = (x, grid) => grid.map(row => row[x]);
const mapGrid = grid => grid.map((row, y) => row.map((tree, x) => isVisible(x, y, grid, tree) ? 'X' : ' '));

// part 1
const isEdge = (x, y, grid) => x === 0 || y === 0 || x === grid[0].length - 1 || y === grid.length - 1;
const isVisibleLeft = (x, y, grid, tree) => !grid[y].slice(0, x).filter(curr => curr >= tree).length;
const isVisibleRight = (x, y, grid, tree) => !grid[y].slice(x+1, grid[y].length).filter(curr => curr >= tree).length;
const isVisibleTop = (x, y, grid, tree) => !getColumn(x, grid).slice(0, y).filter(curr => curr >= tree).length;
const isVisibleBottom = (x, y, grid, tree) => !getColumn(x, grid).slice(y+1, grid[x].length).filter(curr => curr >= tree).length;

const isVisible = (x, y, grid, tree) => isEdge(x, y, grid) 
    || isVisibleLeft(x, y, grid, tree) || isVisibleRight(x, y, grid, tree)
    || isVisibleTop(x, y, grid, tree) || isVisibleBottom(x, y, grid, tree);

const countVisible = grid => grid.reduce((total, row, y) => total += row.reduce((rowTotal, tree, x) => (
    rowTotal += (isVisible(x, y, grid, tree) ? 1 : 0)
), 0), 0);

// part 2
const toLeft = (x, y, grid) => grid[y].slice(0, x).reverse();
const toRight = (x, y, grid) => grid[y].slice(x+1, grid[y].length);
const toTop = (x, y, grid) => getColumn(x, grid).slice(0, y).reverse();
const toBottom = (x, y, grid) => getColumn(x, grid).slice(y+1, grid[x].length);

const directions = (x, y, grid) => 
    [toLeft(x, y, grid), toRight(x, y, grid), toTop(x, y, grid), toBottom(x, y, grid)];

const treesUntilBlocked = (arr, tree) => {
    let trees = 0;
    if (arr.length) {
        for (let i=0; i<arr.length; i++) {
            trees++;
            if (arr[i] >= tree) return trees;
        }
    }
    return trees;
}

const getMostScenicTree = grid => grid.reduce((mostScenic, row, y) => {
    const mostScenicInRow = row.reduce((bestInRow, tree, x) => {
        const score = directions(x, y, grid).reduce(
            (out, dir) => out < 0
                ? treesUntilBlocked(dir, tree)
                : out * treesUntilBlocked(dir, tree) , -1
        );
        return bestInRow > score ? bestInRow : score;
    }, 0);
    return mostScenicInRow > mostScenic ? mostScenicInRow : mostScenic;
}, 0);

console.log(getMostScenicTree(data));