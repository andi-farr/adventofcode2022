import { toStrings } from '../helpers';

const day = '02';
const test = toStrings(day, 'test');
const data = toStrings(day, 'data');

const scores = {
    'A': 1, 'X': 1,
    'B': 2, 'Y': 2,
    'C': 3, 'Z': 3,
}

// part 1

const splitData = arr => arr.map(item => (
    { them: scores[item[0]], me: scores[item[2]] }
));

// part 2

const getPlannedResult = (them, plan) => {
    if (plan === 'Y') return them; // draw, return the same value
    if (plan === 'X') return them - 1 || 3; // lose
    return them + 1 < 4 ? them + 1 : 1; // win
}

const splitForPlan = arr => arr.map(item => (
    { them: scores[item[0]], me: getPlannedResult(scores[item[0]], item[2]) }
));

const getMyScore = input => (
    input.reduce((score, round) => {
       if (round.me === round.them) return score + round.me + 3; // draw
       if (round.me === 3 && round.them === 1) return score + round.me; // i lose
       if ((round.me > round.them) || (round.me === 1 && round.them === 3)) return score + round.me + 6; // i win
       return score + round.me; // i lose
   }, 0)
);

console.log(getMyScore(splitForPlan(test)));
console.log(getMyScore(splitForPlan(data)));