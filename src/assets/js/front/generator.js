let work_speed = 0
let arrayTimes = [];
let totalTimes = 0;
let arrayTimeRep = {};

function resetGenerator() {
    let div = document.getElementById('workoutWrap');
    div.innerHTML = null;
}

function startWorkout() {
    work_speed = random(1, 20);
    let max_min = 0;
    let maxDiffMph = 0;
    totalTimes = 0;
    arrayTimes = [];
    arrayTimeRep = {};
    let strRep = '';

    switch (work_speed) {
        case 1:
            max_min = 1;
            maxDiffMph = 1;
            break;
        case 2:
            max_min = 2;
            maxDiffMph = 2;
            break;
        case 3:
            max_min = 3;
            maxDiffMph = 3;
            break;
        case 4:
            max_min = 5;
            maxDiffMph = 4;
            break;
        default:
            max_min = 10;
            maxDiffMph = 5;
            break;
    }

    recursiveTime(max_min);
    groupRepetition();
    strRep += 'For ' + work_speed + ' SPEED (MPH)* in left of chart we have SPEED <br/><br/>Exercise:<br/> ';
    for (let key in arrayTimeRep) {
        strRep += getMPHLevel(work_speed, key) + ' MPH /' + key + ' min ' + ' x ' + arrayTimeRep[key] + ' Reps <br/>';
    }
    let div = document.getElementById('workoutWrap');
    div.innerHTML = strRep;
}

function random(start, end) {
    return Math.floor((Math.random() * end) + start);
}

function uniq(a) {
    return a.sort().filter((item, pos, ary) => {
        return !pos || item != ary[pos - 1];
    });
}

function recursiveTime(max_min) {
    let nr = random(1, max_min);
    if ((totalTimes + nr) <= 10) {
        totalTimes += nr;
        arrayTimes.push(nr);
    }
    if (totalTimes < 10) {
        recursiveTime(max_min);
    }
}

function groupRepetition() {
    let counts = {};
    arrayTimes.forEach((x) => {
        counts[x] = (counts[x] || 0) + 1;
    });
    arrayTimeRep = counts;
}

function getMPHLevel(initMPH, minutes) {
    let mph = 0;
    let time = minutes;
    if (time == 5) {
        time = 4;
    }

    if (time >= 6) {
        time = 5;
    }

    mph = work_speed + (1 - time);
    return mph;
}