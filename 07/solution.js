import { toStrings } from '../helpers';

const day = '07';
const test = toStrings(day, 'test');
const data = toStrings(day, 'data');

const parseInstruction = str => {
    const inst = str.split(' ');
    if (inst[0] ==='$') {
        // this is a command
        return inst[1] === 'cd' 
            ? { type: 'cd', value: inst[2] } // change directory
            : { type: 'ls' }
    } else {
        // this is a file / dir
        return inst[0] === 'dir'
            ? { type: 'dir', name: inst[1] }
            : { type: 'file', name: inst[1], size: Number(inst[0]) }
    }
};

const parseInstructions = arr => arr.map(parseInstruction);

const makeFileSystem = arr => {
    let fs = { name: '/', files: [], size: 0 };
    let currentDir = fs;
    let stack = [fs];

    const instructions = parseInstructions(arr);

    // cache file sizes to avoid later recursion ;D
    let sizeCache = {};

    const updateSizeCache = (stackDepth, newSize) => {
        // generate key
        const key = stack.slice(0, stackDepth+1).map(dir => dir.name).join('/');
        sizeCache[key] = newSize;
    };

    // file system traversal
    const cd = dirName => {
        currentDir[dirName] = { name: dirName, files: [], size: 0 };
        stack.push(currentDir[dirName]);
        currentDir = stack[stack.length-1];
    }
    
    const cdDotDot = () => {
        stack.pop();
        currentDir = stack[stack.length-1];
    }

    const file = file => {
        currentDir.files.push(file);
        stack.forEach((path, i) => {
            path.size += file.size;
            // let's also cache these for easy retrieval!
            updateSizeCache(i, path.size);
        });
    }

    // build the filesystem
    instructions.forEach(inst => {
        switch (inst.type) {
            case 'cd':
                if (inst.value === '/') break;
                inst.value === '..' ? cdDotDot() : cd(inst.value);
                break;
            case 'file':
                file(inst);
                break;
            default:
                break;
        }
    });

    return { fs, sizeCache };
};

// part 1
const getBiggestFolders = arr => {
    const { sizeCache } = makeFileSystem(arr);
    const dirs = Object.values(sizeCache)
        .reduce((total, size) => size <= 100000 ? total + size : total, 0);
    return dirs;
}

// part 2
const getBestDirToDelete = arr => {
    const { fs, sizeCache } = makeFileSystem(arr);
    // get space we need
    const totalSpace = 70000000;
    const targetSpace = 30000000;
    const freeSpace = totalSpace - fs.size;
    const minDirSize = targetSpace - freeSpace;
    const dirs = Object.values(sizeCache);
    // find the smallest folder bigger than the minimum size required
    const bestDirSize = dirs.reduce((total, size) => size > minDirSize && size < total ? size : total,totalSpace)
    return bestDirSize;
}

console.log(getBestDirToDelete(data));