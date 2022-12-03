import { toStrings } from '../helpers';

const day = '03';
const test = toStrings(day, 'test');
const data = toStrings(day, 'data');

const getPriority = char => {
    const base = char.charCodeAt(0);
    return base < 97 ? base - 38 : base - 96;
}

// part 1

const getPockets = arr => (arr.map(pack => {
    const itemCount = pack.length;
    return { 
        left: pack.slice(0, itemCount / 2),
        right: pack.slice(-itemCount / 2)
    }
}));

const findDuplicateItems = arr => (
    getPockets(arr).map(({ left, right }) => {
        for (let item of left) {
            if (right.includes(item)) return { item, priority: getPriority(item) };
        }
        return "OOPS"; // if this happens, something went wrong ;D
    })
);

const getTotalPriority = arr => findDuplicateItems(arr).reduce((total, row) => total + row.priority, 0);

// part 2

const getGroups = arr => {
    const groupSize = 3;
    let output = [];
    for (let i = 0; i < arr.length; i += groupSize) {
        output = [...output, arr.slice(i, i + groupSize)];
    }
    return output;
};

const findSharedItems = arr => getGroups(arr).map(group => {
    for (let item of group[0]) {
        if (group[1].includes(item) && group[2].includes(item)) return { item, priority: getPriority(item) };
    }
})

const getTotalBadgePriority = arr => findSharedItems(arr).reduce((total, row) => total + row.priority, 0);

console.log(getTotalBadgePriority(test));
console.log(getTotalBadgePriority(data));