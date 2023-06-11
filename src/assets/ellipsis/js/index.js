function mousHover(e, sp) {
    console.log('====================================');
    console.log(e, sp);
    console.log('====================================');
}

var ellipsisObject = {
    row: 0,
    col: 0,
    time: 0,
}

var ellipsisDep = {
    speed: "0",
    time: "0",
    pace: "0",
}

var nextPathSp = 0

var intervalTime

var matrix = new Array(21)

for (var i = 0; i < 21; i++) {
    matrix[i] = new Array(11);
}
const paceArray = ["3.00", "3.10", "3.20", "3.30", "3.45", "4.00", "4.15", "4.35", "5.00", "5.30", "6.00", "6.40", "7.30", "8.30", "10.00", "12.00", "15.00", "20.00", "30.00", "60.00"];
const speedArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
const timeArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];


let { find, isEmpty, forEach, round, filter, indexOf, floor } = _;
let dataObj = [{
        name: "group_1",
        color: "#1f1b21",
        group: ["1/1"],
    },
    {
        name: "group_2",
        color: "#4b295b",
        group: ["2/1", "1/2"],
    },
    {
        name: "group_3",
        color: "#6c2b85",
        group: ["3/1", "2/2", "1/3"],
    },
    {
        name: "group_4",
        color: "#66499c",
        group: ["4/1", "3/2", "2/3", "1/4", "1/5"],
    },
    {
        name: "group_5",
        color: "#7070b5",
        group: ["5/1", "4/2", "3/3", "2/4", "2/5", "1/6", "1/7", "1/8", "1/9", "1/10"],
    },
    {
        name: "group_6",
        color: "#9d9acb",
        group: ["6/1", "5/2", "4/3", "3/4", "3/5", "2/6", "2/7", "2/8", "2/9", "2/10"],
    },
    {
        name: "group_7",
        color: "#99c3e8",
        group: ["7/1", "6/2", "5/3", "4/4", "4/5", "3/6", "3/7", "3/8", "3/9", "3/10"],
    },
    {
        name: "group_8",
        color: "#5fa4db",
        group: ["8/1", "7/2", "6/3", "5/4", "5/5", "4/6", "4/7", "4/8", "4/9", "4/10"],
    },
    {
        name: "group_9",
        color: "#2d6eb5",
        group: ["9/1", "8/2", "7/3", "6/4", "6/5", "5/6", "5/7", "5/8", "5/9", "5/10"],
    },
    {
        name: "group_10",
        color: "#243a7a",
        group: ["10/1", "9/2", "8/3", "7/4", "7/5", "6/6", "6/7", "6/8", "6/9", "6/10"],
    },
    {
        name: "group_11",
        color: "#23544d",
        group: ["11/1", "10/2", "9/3", "8/4", "8/5", "7/6", "7/7", "7/8", "7/9", "7/10"],
    },
    {
        name: "group_12",
        color: "#3a816f",
        group: ["12/1", "11/2", "10/3", "9/4", "9/5", "8/6", "8/7", "8/8", "8/9", "8/10"],
    },
    {
        name: "group_13",
        color: "#56b894",
        group: ["13/1", "12/2", "11/3", "10/4", "10/5", "9/6", "9/7", "9/8", "9/9", "9/10"],
    },
    {
        name: "group_14",
        color: "#c0e0a7",
        group: ["14/1", "13/2", "12/3", "11/4", "11/5", "10/6", "10/7", "10/8", "10/9", "10/10"],
    },
    {
        name: "group_15",
        color: "#ece27e",
        group: ["15/1", "14/2", "13/3", "12/4", "12/5", "11/6", "11/7", "11/8", "11/9", "11/10"],
    },
    {
        name: "group_16",
        color: "#ecda22",
        group: ["16/1", "15/2", "14/3", "13/4", "13/5", "12/6", "12/7", "12/8", "12/9", "12/10"],
    },
    {
        name: "group_17",
        color: "#ff8057",
        group: ["17/1", "16/2", "15/3", "14/4", "14/5", "13/6", "13/7", "13/8", "13/9", "13/10"],
    },
    {
        name: "group_18",
        color: "#ea2525",
        group: ["18/1", "17/2", "16/3", "15/4", "15/5", "14/6", "14/7", "14/8", "14/9", "14/10"],
    },
    {
        name: "group_19",
        color: "#7d0303",
        group: ["19/1", "18/2", "17/3", "16/4", "16/5", "15/6", "15/7", "15/8", "15/9", "15/10"]
    },
    {
        name: "group_20",
        color: "#000",
        group: ["20/1", "19/2", "18/3", "17/4", "17/5", "16/6", "16/7", "16/8", "16/9", "16/10"]
    }
];
let toggleCSS = {
    hideNeighboursGroup: false,
    highlightSelectedGroup: false,
    highlightNeighboursGroup: false,
    hideBlockNameClock: true,
    speedometer: true,
    menuOptions: "openOnTop",
    arrowOptions: "blinkTogether"
};




function findCellDetails(cellText) {
    let cell = find(dataObj, function(obj) {
        return obj.group.indexOf(cellText) !== -1;
    });
    if (isEmpty(cell)) {
        cell = {
            name: "group_21",
            color: "#000"
        }
    }
    return cell;
}

function calcPaceValue(speed) {
    // let paceValue = 60 / speed;
    // let paceMin = floor(paceValue);
    // let paceValueInSec = 3600/speed;
    // let paceSec = paceValueInSec % 60;
    // let paceText = paceMin + "m " + (paceSec ? round(paceSec) + "s" : "");
    let array = ["60.00", "30.00", "20.00", "15.00", "12.00", "10.00", "8.30", "7.30", "6.40", "6.00", "5.30", "5.00", "4.35", "4.15", "4.00", "3.45", "3.30", "3.20", "3.10", "3.00"];
    let pace = array[speed - 1];
    let paceDivide = pace.split(".");
    let paceMin = parseInt(paceDivide[0]);
    let paceSec = parseInt(paceDivide[1]);
    let paceValue = paceMin + (paceSec / 60);
    return { paceValue, paceMin, paceSec };
}

function changeSF() {
    const spValue = document.getElementById('inputSP').value

    const selectSpValue = document.getElementById('selectSP').value

    const spNumber = ellipsisDep.speed * ellipsisDep.time
    console.log('====================================');
    console.log('spNumber', spNumber);
    console.log('====================================');
    let spConversion = 0
    let spMeter = (spNumber * 26.66666667)
    if (selectSpValue == 'SpeedFeet') {
        spConversion = spNumber
    }

    if (selectSpValue == 'Meters') {

        spConversion = (spMeter)
    }

    if (selectSpValue == 'Miles') {

        spConversion = (spMeter / 1609)
    }

    if (selectSpValue == 'Feet') {

        spConversion = (spMeter * 3)
    }

    if (selectSpValue == 'Speed') {

        spConversion = ellipsisDep.speed
    }

    if (selectSpValue == 'KM') {

        spConversion = (spMeter / 1000)
    }
    spConversion = spConversion + ''

    spConversion = spConversion.split('.')[0] + '.' + spConversion.split('.')[1].substr(0, 2)

    spConversion = spConversion.split('.')[1] == '00' ? spConversion.split('.')[0] : spConversion
    document.getElementById('inputSP').value = spConversion

}

function changeSPForLaps(status) {

    console.log('====================================');
    console.log('changeSPForLaps', status);
    console.log('====================================');
    const speedValue = parseInt(ellipsisDep.speed)
    const timeValue = parseInt(ellipsisDep.time)

    //

    let ellipsisNumber = speedValue * timeValue

    console.log('====================================');
    console.log('nextPathSp', nextPathSp);
    console.log('nextPathSp', nextPathSp);
    console.log('====================================');

    if (status === 'up') {
        nextPathSp = nextPathSp + 1
            //  d3.select("#numberOfEllipsis")
            //    .text(nextPathSp + '');

        if (nextPathSp < 150) {
            changeSFLaps(nextPathSp)
        } else {
            alert('max Ellipsis 150 ')
        }


    } else {

        nextPathSp = nextPathSp - 1

        // d3.select("#numberOfEllipsis")
        //    .text(nextPathSp + '');

        if (nextPathSp > 0) {
            changeSFLaps(nextPathSp)
        } else {

        }

    }
}

function changeSFLaps(spValue) {
    const speedValue = parseInt(ellipsisDep.speed)
    const timeValue = parseInt(ellipsisDep.time)

    console.log('====================================');
    console.log('spValue', spValue);
    console.log('speedValue', speedValue);
    console.log('spValue % speedValue', spValue % speedValue);
    console.log('timeValue', timeValue);
    console.log('spValue % timeValue', spValue % timeValue);
    console.log('====================================');
    console.log('====================================');
    console.log('matrixmatrix', matrix);
    console.log('====================================');
    if (spValue > 0) {
        if (speedValue > 0 || timeValue > 0) {
            const timeFromSelected = spValue / speedValue
            const speedFromSelected = spValue / timeValue
            if (spValue % speedValue === 0 && timeFromSelected <= 10) {
                console.log('====================================');
                console.log('timeFromSelected', timeFromSelected);
                console.log('====================================');
                console.log('====================================');
                console.log('matrix[spValue][timeFromSelected].', matrix[speedValue]);
                console.log('====================================');
                const cell = matrix[speedValue][timeFromSelected].cell
                const cellId = matrix[speedValue][timeFromSelected].cellId
                const row = matrix[speedValue][timeFromSelected].row
                const col = matrix[speedValue][timeFromSelected].col
                const time = matrix[speedValue][timeFromSelected].pace
                handleClickBlock(cell, cellId, row, col, time)

            } else if (spValue % timeValue === 0 && speedFromSelected <= 20) {
                console.log('====================================');
                console.log('speedFromSelected', speedFromSelected);
                console.log('====================================');
                console.log('====================================');
                console.log('matrix[speedFromSelected][timeValue]', matrix[speedFromSelected]);
                console.log('====================================');
                const cell = matrix[speedFromSelected][timeValue].cell
                const cellId = matrix[speedFromSelected][timeValue].cellId
                const row = matrix[speedFromSelected][timeValue].row
                const col = matrix[speedFromSelected][timeValue].col
                const time = matrix[speedFromSelected][timeValue].pace

                handleClickBlock(cell, cellId, row, col, time)

            } else {
                alert('No SpeeFit for the selected Speed or Time ')
                d3.select("#numberOfEllipsis")
                    .text(spValue + '');
            }
        } else {
            alert('you have to select Speed or Time ')
        }
    } else if (spValue > 150) {

        alert('max Ellipsis 150 ')
    }
}

function resetAll() {


    d3.select('#lapGroupPath').selectAll('text').remove();
    d3.select('#lapGroupPath').selectAll('path').remove();
    ellipsisDep = {
        speed: 0 + '',
        time: 0 + '',
        pace: 0 + '',
    }
    document.getElementById('inputSP').value = 0
    document.getElementById('selectSP').value = 'SpeedFeet'
    initDetailsText()
    initAnalog();
    initSVGAnalog()

    if (intervalTime) {
        clearInterval(intervalTime)
    }





    speedFitObject.row = 0;
    speedFitObject.col = 0;
    speedFitObject.time = 0;
    console.log('asd');

    nextPathSp = 0

    d3.select("#sample-minute-hand").attr('class', null)

    d3.select("#minute-hand").attr('class', null)

    d3.select("#clockWise").attr("y2", "5");

    reset()


    for (let index = 1; index <= 90; index++) {
        let compName = "#t" + index;
        let compName2 = "#tt" + index;
        d3.select(compName).style("opacity", "0.3");
        d3.select(compName2).style("opacity", "0.3");

    }
    for (let index = 91; index <= 150; index++) {
        let compName = "#t" + index;
        let compName2 = "#tt" + index;
        d3.select(compName).style("opacity", "0");
        d3.select(compName2).style("opacity", "0");

    }

    defautldrawSampleLaps()

    swipefunc();
}



for (let index = 1; index <= 90; index++) {
    let compName = "#t" + index;
    let compName2 = "#tt" + index;
    d3.select(compName).style("opacity", "0.3");
    d3.select(compName2).style("opacity", "0.3");

}
for (let index = 91; index <= 150; index++) {
    let compName = "#t" + index;
    let compName2 = "#tt" + index;
    d3.select(compName).style("opacity", "0");
    d3.select(compName2).style("opacity", "0");

}

function handleClickBlock(cell, cellId, row, col, time) {
    console.log('====================================');
    console.log('matrixmatrixmatrix', matrix, time);
    console.log('====================================');

    ellipsisDep = {
        speed: row + '',
        time: col + '',
        pace: time + '',
    }

    d3.select('#lapGroupPath').selectAll('text').remove();
    d3.select('#lapGroupPath').selectAll('path').remove();
    initDetailsText()
    initAnalog();
    initSVGAnalog()

    if (intervalTime) {
        clearInterval(intervalTime)
    }


    for (let index = 1; index <= 90; index++) {
        let compName = "#t" + index;
        let compName2 = "#tt" + index;
        d3.select(compName).style("opacity", "0.3");
        d3.select(compName2).style("opacity", "0.3");

    }

    for (let index = 91; index <= 150; index++) {
        let compName = "#t" + index;
        let compName2 = "#tt" + index;
        d3.select(compName).style("opacity", "0");
        d3.select(compName2).style("opacity", "0");

    }

    const cellule = row * col
    const lapsCell = cellule / 15
    console.log('====================================');
    console.log('parseInt(lapsCell) == lapsCell', parseInt(lapsCell), lapsCell, parseInt(lapsCell) == lapsCell);
    console.log('====================================');
    const lapsCellInt = parseInt(lapsCell) == lapsCell ? lapsCell : parseInt(lapsCell) + 1
    const cellsNum = (lapsCellInt * 15)

    console.log(cellsNum, lapsCellInt)

    for (let index = 1; index <= cellsNum; index++) {
        let compName = "#t" + index;
        let compName2 = "#tt" + index;
        d3.select(compName).style("opacity", "0.3");
        d3.select(compName2).style("opacity", "0.3");

    }

    for (let index = 1; index <= cellule; index++) {
        let compName = "#t" + index;
        let compName2 = "#tt" + index;
        d3.select(compName).style("opacity", "1");
        d3.select(compName2).style("opacity", "1");


        const ellipsisMoy = (index) / 15
        const ellipsisLapsNum = parseInt((index) / 15)

        drawLapsCount(ellipsisLapsNum, ellipsisMoy, index + 1, cellule)

    }

    console.log('ellipsisDepspeedFitDep', ellipsisDep);


    selectBlock(cell, cellId, row, col);
    addDetailsText(cellId, row, col);
    updateAnalog(row, col);
    document.getElementById('inputSP').value = row * col
    document.getElementById('selectSP').value = 'SpeedFeet'
    speedFitObject.row = row;
    speedFitObject.col = col;
    speedFitObject.time = time;
    console.log('asd');

    nextPathSp = row * col


    d3.select("#sample-minute-hand").attr('class', null)

    d3.select("#minute-hand").attr('class', null)
    $("#buttonStart").show()
    $("#buttonWorkout").hide()

    d3.select("#clockWise").attr("y2", "5");
}

function selectBlock(cell, cellId, row, col) {

    $(".square").removeClass("selectedCell");
    $(".square").removeClass("semiHideCell");
    $(".square").removeClass("highlightGroupCell");
    $("#block-" + cellId).addClass("selectedCell");
    let groupName = cell.name;
    let nameIndex = groupName.split("_");

    let selectedGroupIndex = parseInt(nameIndex[1] - 1);
    let selectedGroup = dataObj[selectedGroupIndex];
    let selectedGroupArray = null;
    if (!isEmpty(selectedGroup)) {
        selectedGroupArray = selectedGroup.group;
        if (toggleCSS.highlightSelectedGroup) {
            for (let row = 20; row > 0; row--) {
                for (let col = 1; col < 11; col++) {
                    let checkValue = row + "/" + col;
                    if (selectedGroupArray.indexOf(checkValue) == -1) {
                        let highlightCellId = row + "_" + col;
                        $("#block-" + highlightCellId).addClass("highlightGroupCell");
                    }
                }
            }
        }
    }

    let belowGroupArray = null;
    if (selectedGroupIndex > 0) {
        let belowGroupIndex = parseInt(nameIndex[1] - 2);
        let belowGroup = dataObj[belowGroupIndex];
        belowGroupArray = belowGroup.group;
        if (toggleCSS.hideNeighboursGroup) {
            forEach(belowGroupArray, function(value) {
                let indexes = value.split("/");
                let top = parseInt(indexes[0]);
                let left = parseInt(indexes[1]);
                let semiHideCellId = top + "_" + left;
                $("#block-" + semiHideCellId).addClass("semiHideCell");
            });
        }
        if (toggleCSS.highlightNeighboursGroup) {
            forEach(belowGroupArray, function(value) {
                let indexes = value.split("/");
                let top = parseInt(indexes[0]);
                let left = parseInt(indexes[1]);
                for (let i = 1; i < top; i++) {
                    let highlightCellId = i + "_" + left;
                    $("#block-" + highlightCellId).addClass("highlightGroupCell");
                }
            });
        }
    }

    let aboveGroupIndex = parseInt(nameIndex[1]);
    let aboveGroup = dataObj[aboveGroupIndex];
    let aboveGroupArray = null;
    if (!isEmpty(aboveGroup)) {
        aboveGroupArray = aboveGroup.group;
        if (toggleCSS.hideNeighboursGroup) {
            forEach(aboveGroupArray, function(value) {
                let indexes = value.split("/");
                let top = parseInt(indexes[0]);
                let left = parseInt(indexes[1]);
                let semiHideCellId = top + "_" + left;
                $("#block-" + semiHideCellId).addClass("semiHideCell");
            });
        }
        if (toggleCSS.highlightNeighboursGroup) {
            forEach(aboveGroupArray, function(value) {
                let indexes = value.split("/");
                let top = parseInt(indexes[0]);
                let left = parseInt(indexes[1]);
                for (let i = 20; i > top; i--) {
                    let highlightCellId = i + "_" + left;
                    $("#block-" + highlightCellId).addClass("highlightGroupCell");
                }
            });
        }
    }

    let neighbourCells = [{
            name: "topLeft",
            id: "#block-" + (row + 1) + "_" + (col - 1),
            value: (row + 1) + "/" + (col - 1),
            row: row + 1,
            col: col - 1
        },
        {
            name: "topCenter",
            id: "#block-" + (row + 1) + "_" + (col),
            value: (row + 1) + "/" + (col),
            row: row + 1,
            col: col
        },
        {
            name: "topRight",
            id: "#block-" + (row + 1) + "_" + (col + 1),
            value: (row + 1) + "/" + (col + 1),
            row: row + 1,
            col: col + 1
        },
        {
            name: "left",
            id: "#block-" + row + "_" + (col - 1),
            value: row + "/" + (col - 1),
            row: row,
            col: col - 1
        },
        {
            name: "right",
            id: "#block-" + row + "_" + (col + 1),
            value: row + "/" + (col + 1),
            row: row,
            col: col + 1
        },
        {
            name: "bottomLeft",
            id: "#block-" + (row - 1) + "_" + (col - 1),
            value: (row - 1) + "/" + (col - 1),
            row: row - 1,
            col: col - 1
        },
        {
            name: "bottomCenter",
            id: "#block-" + (row - 1) + "_" + (col),
            value: (row - 1) + "/" + (col),
            row: row - 1,
            col: col
        },
        {
            name: "bottomRight",
            id: "#block-" + (row - 1) + "_" + (col + 1),
            value: (row - 1) + "/" + (col + 1),
            row: row - 1,
            col: col + 1
        }
    ];
    let possibleNeighbourCells = filter(neighbourCells, function(obj) {
        let cellValue = obj.value;
        let selectedCell = d3.select(obj.id);
        if (selectedCell.empty() || selectedCell.classed("disableCell")) {
            return false;
        }
        if (!isEmpty(aboveGroupArray) && indexOf(aboveGroupArray, cellValue) !== -1) {
            return true;
        }
        if (!isEmpty(belowGroupArray) && indexOf(belowGroupArray, cellValue) !== -1) {
            return true;
        }
        if (!isEmpty(selectedGroupArray) && indexOf(selectedGroupArray, cellValue) !== -1) {
            return true;
        }
        return false;
    });
    let selectedCellId = "#block-" + cellId;
    drawNeighbourArrows(possibleNeighbourCells, selectedCellId);
    drawSampleBlocks(row, col, possibleNeighbourCells, selectedCellId);
}

function drawNeighbourArrows(possibleNeighbourCells, selectedCellId) {
    d3.select('#nextCellPath').remove();
    d3.select("#gridSVG").append("g").attr("id", "nextCellPath");
    let scv = {
        x: parseInt(d3.select(selectedCellId).attr('x')),
        y: parseInt(d3.select(selectedCellId).attr('y')),
        width: parseInt(d3.select(selectedCellId).attr('width')),
        height: parseInt(d3.select(selectedCellId).attr('height'))
    };

    forEach(possibleNeighbourCells, function(neighbourCell) {
        let { id } = neighbourCell;
        let ncv = {
            x: parseInt(d3.select(id).attr('x')),
            y: parseInt(d3.select(id).attr('y')),
            width: parseInt(d3.select(id).attr('width')),
            height: parseInt(d3.select(id).attr('height'))
        };
        let x1 = 0;
        let y1 = 0;
        let x2 = 0;
        let y2 = 0;
        let path = null;
        switch (neighbourCell.name) {
            case 'topLeft':
                x1 = scv.x + 20;
                y1 = scv.y + 20;
                x2 = ncv.x + ncv.width - 15;
                y2 = ncv.y + ncv.height - 10;
                d3.select("#nextCellPath").append("path")
                    .attr("id", "ap_8")
                    .attr("class", "arrowPathClass")
                    .style("stroke", "#ff0078")
                    .style("stroke-width", "4")
                    .attr("marker-end", "url(#arrow)")
                    .attr("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);

                break;
            case 'topCenter':
                x1 = scv.x + (scv.width / 2);
                y1 = scv.y + 20;
                x2 = ncv.x + (ncv.width / 2);
                y2 = ncv.y + ncv.height - 5;
                d3.select("#nextCellPath").append("path")
                    .attr("id", "ap_1")
                    .attr("class", "arrowPathClass")
                    .style("stroke", "#ff0078")
                    .style("stroke-width", "4")
                    .attr("marker-end", "url(#arrow)")
                    .attr("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);
                break;
            case 'topRight':
                x1 = scv.x + ncv.width - 20;
                y1 = scv.y + 20;
                x2 = ncv.x + 15;
                y2 = ncv.y + ncv.height - 10;
                d3.select("#nextCellPath").append("path")
                    .attr("id", "ap_2")
                    .attr("class", "arrowPathClass")
                    .style("stroke", "#ff0078")
                    .style("stroke-width", "4")
                    .attr("marker-end", "url(#arrow)")
                    .attr("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);
                break;
            case 'left':
                x1 = scv.x + 5;
                y1 = scv.y + (scv.height / 2);
                x2 = ncv.x + ncv.width - 5;
                y2 = ncv.y + (ncv.height / 2);
                d3.select("#nextCellPath").append("path")
                    .attr("id", "ap_7")
                    .attr("class", "arrowPathClass")
                    .style("stroke", "#ff0078")
                    .style("stroke-width", "4")
                    .attr("marker-end", "url(#arrow)")
                    .attr("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);
                break;
            case 'right':
                x1 = scv.x + scv.width - 5;
                y1 = scv.y + (scv.height / 2);
                x2 = ncv.x + 5;
                y2 = ncv.y + (ncv.height / 2);
                d3.select("#nextCellPath").append("path")
                    .attr("id", "ap_3")
                    .attr("class", "arrowPathClass")
                    .style("stroke", "#ff0078")
                    .style("stroke-width", "4")
                    .attr("marker-end", "url(#arrow)")
                    .attr("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);
                break;
                break;
            case 'bottomLeft':
                x1 = scv.x + 20;
                y1 = scv.y + ncv.height - 20;
                x2 = ncv.x + ncv.width - 15;
                y2 = ncv.y + 15;
                d3.select("#nextCellPath").append("path")
                    .attr("id", "ap_6")
                    .attr("class", "arrowPathClass")
                    .style("stroke", "#ff0078")
                    .style("stroke-width", "4")
                    .attr("marker-end", "url(#arrow)")
                    .attr("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);
                break;
            case 'bottomCenter':
                x1 = scv.x + (scv.width / 2);
                y1 = scv.y + ncv.height - 20;
                x2 = ncv.x + (ncv.width / 2);
                y2 = ncv.y + 15;
                d3.select("#nextCellPath").append("path")
                    .attr("id", "ap_5")
                    .attr("class", "arrowPathClass")
                    .style("stroke", "#ff0078")
                    .style("stroke-width", "4")
                    .attr("marker-end", "url(#arrow)")
                    .attr("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);
                break;
            case 'bottomRight':
                x1 = scv.x + ncv.width - 20;
                y1 = scv.y + ncv.height - 20;
                x2 = ncv.x + 15;
                y2 = ncv.y + 15;
                d3.select("#nextCellPath").append("path")
                    .attr("id", "ap_4")
                    .attr("class", "arrowPathClass")
                    .style("stroke", "#ff0078")
                    .style("stroke-width", "4")
                    .attr("marker-end", "url(#arrow)")
                    .attr("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);
                break;
        }
    });
}

function initDetailsText() {
    d3.select('#lapGroupPathIntern').selectAll('text').remove();
    d3.select('#lapGroupPathIntern').selectAll('path').remove();
    // d3.select('#analogText').selectAll('text').remove();
    document.getElementById('inputSP').value = 0
    document.getElementById('selectSP').value = 'SpeedFeet'


    /*  d3.select("#lapGroupPathIntern").append("text")
          .attr("class", "textDetails text-lap")
          .attr("x", 230)
          .attr("y", 270)
          .text('Speed /');*/



    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "textDetails")
        .attr("x", 265)
        .attr("y", 290)
        .text('0');


    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "textDetails")
        .attr("x", 295)
        .attr("y", 290)
        .text('/');


    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "textDetails")
        .attr("x", 325)
        .attr("y", 290)
        .text('0');


    /*  d3.select("#lapGroupPathIntern").append("text")
         .attr("class", "textDetails  text-lap")
         .attr("x", 350)
         .attr("y", 270)
         .text('Time');*/


    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "paceText textDetails ")
        .attr("x", 240)
        .attr("y", 325)
        .text('Pace');

    /*    d3.select("#lapGroupPathIntern").append("text")
          .attr("class", "textDetails arrows-lap")
          .attr("x", 265)
          .attr("y", 295)
          .text("▲")
          .on("click", function() {
              addPace('down')
          });
      d3.select("#lapGroupPathIntern").append("text")
          .attr("class", "textDetails arrows-lap")
          .attr("x", 265)
          .attr("y", 305)
          .text("▼")
          .on("click", function() {
              addPace('up')
          });*/

    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "paceText textDetails")
        .attr("x", 305)
        .attr("y", 325)
        .text('0');

    /*   d3.select("#lapGroupPathIntern").append("text")
          .attr("class", "textDetails")
          .attr("x", 295)
          .attr("y", 320)
          .text('00');

      d3.select("#lapGroupPathIntern").append("text")
          .attr("class", "textDetails")
          .attr("x", 315)
          .attr("y", 320)
          .text('LP');

      d3.select("#lapGroupPathIntern").append("text")
          .attr("class", "textDetails arrows-lap")
          .attr("x", 360)
          .attr("y", 295)
          .text("▲")
          .on("click", function() {
              changeSPForLaps('up')
          });

      d3.select("#lapGroupPathIntern").append("text")
          .attr("class", "textDetails arrows-lap")
          .attr("x", 360)
          .attr("y", 305)
          .text("▼")
          .on("click", function() {
              changeSPForLaps('down')
          });*/

    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "sfText textDetails")
        .attr("x", 240)
        .attr("y", 260)
        .text('0');

    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "sfText textDetails")
        .attr("x", 250)
        .attr("y", 260)
        .text('SF');

    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "textDetails arrows-lap")
        .attr("x", 265)
        .attr("y", 263)
        .text("▲")
        .on("click", function() {
            addSpeed('up')
        });
    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "textDetails arrows-lap")
        .attr("x", 265)
        .attr("y", 305)
        .text("▼")
        .on("click", function() {
            addSpeed('down')
        });

    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "textDetails arrows-lap")
        .attr("x", 325)
        .attr("y", 263)
        .text("▲")
        .on("click", function() {
            addTime('up')
        });
    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "textDetails arrows-lap")
        .attr("x", 325)
        .attr("y", 305)
        .text("▼")
        .on("click", function() {
            addTime('down')
        });

}

initDetailsText()

function addDetailsText() {
    d3.select('#lapGroupPathIntern').selectAll('text').remove();
    d3.select('#lapGroupPathIntern').selectAll('path').remove();
    // d3.select('#analogText').selectAll('text').remove();
    document.getElementById('inputSP').value = 0
    document.getElementById('selectSP').value = 'SpeedFeet'

    const ellipsisNum = + ellipsisDep.speed * + ellipsisDep.time
    let laps = ellipsisNum / 15;


    const lapsInt = parseInt(speedFitNum / 15)


    document.getElementById('inputSP').value = ellipsisNum

    /* d3.select("#lapGroupPathIntern").append("text")
         .attr("class", "textDetails")
         .attr("x", 230)
         .attr("y", 270)
         .text('Speed');*/


    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "textDetails")
        .attr("x", (ellipsisDep.speed < 10 ? 265 : 250))
        .attr("y", 290)
        .text(ellipsis.speed);


    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "textDetails")
        .attr("x", 295)
        .attr("y", 290)
        .text('/');


    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "textDetails")
        .attr("x", ellipsis.time < 10 ? 325 : 315)
        .attr("y", 290)
        .text(ellipsisDep.time);


    /*    d3.select("#lapGroupPathIntern").append("text")
          .attr("class", "textDetails")
          .attr("x", 350)
          .attr("y", 270)
          .text('Time');*/


    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "paceText textDetails")
        .attr("x", 240)
        .attr("y", 325)
        .text('Pace');

    /* d3.select("#lapGroupPathIntern").append("text")
         .attr("class", "textDetails arrows-lap")
         .attr("x", 265)
         .attr("y", 295)
         .text("▲")
         .on("click", function() {

             addPace('down')
         });
     d3.select("#lapGroupPathIntern").append("text")
         .attr("class", "textDetails arrows-lap")
         .attr("x", 265)
         .attr("y", 305)
         .text("▼")
         .on("click", function() {

             addPace('up')
         });*/
    const paceInt = parseInt(ellipsisDep.pace)
    const paceFloat = ellipsisDep.pace + ''
    console.log('====================================');
    console.log('paceFloat', paceFloat);
    console.log('====================================');
    const paceRest = paceFloat.substr(paceFloat.indexOf('.') + 1, 2)

    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "paceText textDetails")
        .attr("x", 305)
        .attr("y", 325)
        .text(paceInt);

    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "textDetails3")
        .attr("x", paceInt < 10 ? 318 : 333)
        .attr("y", 315)
        .text(paceRest);

    // speedFitDep.pace < 10 ? 0 : '')
    /* d3.select("#lapGroupPathIntern").append("text")
         .attr("class", "textDetails")
         .attr("x", 295)
         .attr("y", 320)
         .text(lapsInt);

     d3.select("#lapGroupPathIntern").append("text")
         .attr("class", "textDetails")
         .attr("x", 315)
         .attr("y", 320)
         .text('LP');



     d3.select("#lapGroupPathIntern").append("text")
         .attr("class", "textDetails arrows-lap")
         .attr("x", 360)
         .attr("y", 295)
         .text("▲")
         .on("click", function() {
             changeSPForLaps('up')
         });
     d3.select("#lapGroupPathIntern").append("text")
         .attr("class", "textDetails arrows-lap")
         .attr("x", 360)
         .attr("y", 305)
         .text("▼")
         .on("click", function() {
             changeSPForLaps('down')
         });*/

    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "sfText textDetails")
        .attr('id', 'numberOfSpeedFit')
        .attr("x", ellipsisNum < 10 ? 240 : (ellipsisNum < 100 ? 230 : 220))
        .attr("y", 260)
        .text(ellipsisNum);

    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "sfText textDetails")
        .attr("x", 250)
        .attr("y", 260)
        .text('SF');



    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "textDetails arrows-lap")
        .attr("x", 325)
        .attr("y", 263)
        .text("▲")
        .on("click", function() {
            addTime('up')
        });
    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "textDetails arrows-lap")
        .attr("x", 325)
        .attr("y", 305)
        .text("▼")
        .on("click", function() {
            addTime('down')
        });

    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "textDetails arrows-lap")
        .attr("x", 265)
        .attr("y", 263)
        .text("▲")
        .on("click", function() {
            addSpeed('up')
        });
    d3.select("#lapGroupPathIntern").append("text")
        .attr("class", "textDetails arrows-lap")
        .attr("x", 265)
        .attr("y", 305)
        .text("▼")
        .on("click", function() {
            addSpeed('down')
        });

}

$("#buttonStart").show()
$("#buttonWorkout").hide()

$("#buttonReset").on('click', (e) => {
    resetAll()
    $("#buttonWorkout").hide()
    $("#buttonStart").show()
})

$("#buttonStart").on('click', (e) => {
    d3.select('#lapGroupPath').selectAll('text').remove();
    d3.select('#lapGroupPath').selectAll('path').remove();
    const speedConst = parseInt(ellipsisDep.speed)
    const timeConst = parseInt(ellipsisDep.time)
    const paceConst = + ellipsisDep.pace
    var ellipsiss = speedConst * timeConst;
    if (ellipsiss > 0) {



        d3.selectAll(".st0").style("opacity", "0.3");
        d3.select("#minute-hand").attr('class', null)
        d3.select("#sample-minute-hand").attr('class', null)
        console.log('e', e, ellipsisObject);
        var i = 1;

        $("#buttonReset").show()
        $("#buttonStart").hide()
        $("#buttonWorkout").show()

        for (let index = 1; index <= 60; index++) {
            let compName = "#t" + index;
            let compName2 = "#tt" + index;
            d3.select(compName).style("opacity", "0.3");
            d3.select(compName2).style("opacity", "0.3");

        }
        for (let index = 91; index <= 150; index++) {
            let compName = "#t" + index;
            let compName2 = "#tt" + index;
            d3.select(compName).style("opacity", "0");
            d3.select(compName2).style("opacity", "0");

        }

        console.log('====================================');
        console.log('speedfits', speedfits);
        console.log('====================================');
        addDetailsText()
        const cellule = speedConst * timeConst
        const lapsCell = cellule / 15
        console.log('====================================');
        console.log('parseInt(lapsCell) == lapsCell', parseInt(lapsCell), lapsCell, parseInt(lapsCell) == lapsCell);
        console.log('====================================');
        const lapsCellInt = parseInt(lapsCell) == lapsCell ? lapsCell : parseInt(lapsCell) + 1
        const cellsNum = (lapsCellInt * 15)

        console.log(cellsNum, lapsCellInt)

        for (let index = 1; index <= cellsNum; index++) {
            let compName = "#t" + index;
            let compName2 = "#tt" + index;
            d3.select(compName).style("opacity", "0.3");
            d3.select(compName2).style("opacity", "0.3");

        }


        const timing = paceConst * 1000
        console.log('====================================');
        console.log('paceConst', paceConst);
        console.log('timeConst', timeConst);
        console.log('timing', timing);
        console.log('====================================');
        if (timeConst != 0) {
            d3.select("#minute-hand").attr("class", "minuteHand");
            d3.select("#sample-minute-hand").attr("class", "minuteHand");
            d3.select("#clockWise").attr("y2", "10");


            intervalTime = setInterval(() => {
                console.log('i', i);
                let compName = "#t" + i;
                let compName2 = "#tt" + i;

                console.log('compName', compName);
                d3.select(compName).style("opacity", "1");
                d3.select(compName2).style("opacity", "1");

                i++;
                console.log(i, speedfits)
                if (i > speedfits) {
                    clearInterval(intervalTime);
                    d3.select("#sample-minute-hand").attr('class', null)

                    d3.select("#minute-hand").attr('class', null)

                    d3.select("#clockWise").attr("y2", "5");
                }

                const ellipsisMoy = (i - 1) / 15
                const ellipsisLapsNum = parseInt((i - 1) / 15)

                drawLapsCount(speedfitLapsNum, speedfitMoy, i, speedfits)


            }, timing);
        }
    } else {

        alert('you have to select SpeedFit ')
    }

})

//translate(495, 423) rotate(-50)


function drawLapsCount(lapsNum, LapsMoy, spNum, allSp) {
    const spN = spNum - 1 - (15 * lapsNum)
    console.log('====================================');
    console.log('lapsNum, LapsMoy, spNum', lapsNum, LapsMoy, spNum);
    console.log('====================================');
    if ((spNum > allSp) && (spNum < 150)) {
        if (LapsMoy > lapsNum) {
            d3.select('#lapGroupPath').selectAll('#sp1').remove();
            switch (lapsNum) {
                case 0:
                    d3.select("#lapGroupPath").append("text")
                        .attr("id", "sp1")
                        .attr("class", "textDetails2")
                        .attr("transform", "translate(395, 399) rotate(-24)")
                        .attr("x", spN < 10 ? 10 : 0)
                        .attr("y", 0)
                        .text(spN + ' SF');
                    break;
                case 1:
                    d3.select("#lapGroupPath").append("text")
                        .attr("id", "sp1")
                        .attr("class", "textDetails2")
                        .attr("transform", "translate(390, 383) rotate(-24)")
                        .attr("x", spN < 10 ? 10 : 0)
                        .attr("y", 0)
                        .text(spN + ' SF');
                    break;
                case 2:
                    d3.select("#lapGroupPath").append("text")
                        .attr("id", "sp1")
                        .attr("class", "textDetails2")
                        .attr("transform", "translate(380, 369) rotate(-23)")
                        .attr("x", spN < 10 ? 10 : 0)
                        .attr("y", 0)
                        .text(spN + ' SF');
                    break;
                case 3:
                    d3.select("#lapGroupPath").append("text")
                        .attr("id", "sp1")
                        .attr("class", "textDetails2")
                        .attr("transform", "translate(370, 355) rotate(-22)")
                        .attr("x", spN < 10 ? 10 : 0)
                        .attr("y", 0)
                        .text(spN + ' SF');
                    break;
                case 4:
                    d3.select("#lapGroupPath").append("text")
                        .attr("id", "sp1")
                        .attr("class", "textDetails2")
                        .attr("transform", "translate(360, 341) rotate(-21)")
                        .attr("x", spN < 10 ? 10 : 0)
                        .attr("y", 0)
                        .text(spN + ' SF');
                    break;
                case 5:
                    d3.select("#lapGroupPath").append("text")
                        .attr("id", "sp1")
                        .attr("class", "textDetails2")
                        .attr("transform", "translate(350, 327) rotate(-20)")
                        .attr("x", spN < 10 ? 10 : 0)
                        .attr("y", 0)
                        .text(spN + ' SF');
                    break;
                case 6:
                    d3.select("#lapGroupPath").append("text")
                        .attr("id", "sp1")
                        .attr("class", "textDetails2")
                        .attr("transform", "translate(340, 312) rotate(-17)")
                        .attr("x", spN < 10 ? 10 : 0)
                        .attr("y", 0)
                        .text(spN + ' SF');
                    break;
                case 7:
                    d3.select("#lapGroupPath").append("text")
                        .attr("id", "sp1")
                        .attr("class", "textDetails2")
                        .attr("transform", "translate(328, 296) rotate(-13)")
                        .attr("x", spN < 10 ? 10 : 0)
                        .attr("y", 0)
                        .text(spN + ' SF');
                    break;
                case 8:
                    d3.select("#lapGroupPath").append("text")
                        .attr("id", "sp1")
                        .attr("class", "textDetails2")
                        .attr("transform", "translate(315, 281) rotate(-8)")
                        .attr("x", spN < 10 ? 10 : 0)
                        .attr("y", 0)
                        .text(spN + ' SF');
                    break;
                case 9:
                    d3.select("#lapGroupPath").append("text")
                        .attr("id", "sp1")
                        .attr("class", "textDetails2")
                        .attr("transform", "translate(305, 263) rotate(-3)")
                        .attr("x", spN < 10 ? 10 : 0)
                        .attr("y", 0)
                        .text(spN + ' SF');
                    break;
                default:
                    break;
            }
        }
    }


    switch (lapsNum) {
        case 1:
            d3.select('#lapGroupPath').selectAll('#lap1').remove();
            d3.select("#lapGroupPath").append("text")
                .attr("id", "lap1")
                .attr("class", "textDetails2")
                .attr("transform", "translate(428, 382) rotate(-20)")
                .attr("x", 0)
                .attr("y", 0)
                .text('1');
            break;
        case 2:
            d3.select('#lapGroupPath').selectAll('#lap2').remove();
            d3.select("#lapGroupPath").append("text")
                .attr("id", "lap2")
                .attr("class", "textDetails2")
                .attr("transform", "translate(418, 369) rotate(-20)")
                .attr("x", 0)
                .attr("y", 0)
                .text('2');
            break;
        case 3:
            d3.select('#lapGroupPath').selectAll('#lap3').remove();
            d3.select("#lapGroupPath").append("text")
                .attr("id", "lap3")
                .attr("class", "textDetails2")
                .attr("transform", "translate(408, 356) rotate(-20)")
                .attr("x", 0)
                .attr("y", 0)
                .text('3');
            break;
        case 4:
            d3.select('#lapGroupPath').selectAll('#lap4').remove();
            d3.select("#lapGroupPath").append("text")
                .attr("id", "lap4")
                .attr("class", "textDetails2")
                .attr("transform", "translate(398, 343) rotate(-20)")
                .attr("x", 0)
                .attr("y", 0)
                .text('4');
            break;
        case 5:
            d3.select('#lapGroupPath').selectAll('#lap5').remove();
            d3.select("#lapGroupPath").append("text")
                .attr("id", "lap5")
                .attr("class", "textDetails2")
                .attr("transform", "translate(388, 330) rotate(-20)")
                .attr("x", 0)
                .attr("y", 0)
                .text('5');
            break;
        case 6:
            d3.select('#lapGroupPath').selectAll('#lap6').remove();
            d3.select("#lapGroupPath").append("text")
                .attr("id", "lap6")
                .attr("class", "textDetails2")
                .attr("transform", "translate(378, 316) rotate(-20)")
                .attr("x", 0)
                .attr("y", 0)
                .text('6');
            break;
        case 7:
            d3.select('#lapGroupPath').selectAll('#lap7').remove();
            d3.select("#lapGroupPath").append("text")
                .attr("id", "lap7")
                .attr("class", "textDetails2")
                .attr("transform", "translate(368, 303) rotate(-20)")
                .attr("x", 0)
                .attr("y", 0)
                .text('7');
            break;
        case 8:
            d3.select('#lapGroupPath').selectAll('#lap8').remove();
            d3.select("#lapGroupPath").append("text")
                .attr("id", "lap8")
                .attr("class", "textDetails2")
                .attr("transform", "translate(358, 289) rotate(-20)")
                .attr("x", 0)
                .attr("y", 0)
                .text('8');
            break;
        case 9:
            d3.select('#lapGroupPath').selectAll('#lap9').remove();
            d3.select("#lapGroupPath").append("text")
                .attr("id", "lap9")
                .attr("class", "textDetails2")
                .attr("transform", "translate(348, 275) rotate(-20)")
                .attr("x", 0)
                .attr("y", 0)
                .text('9');
            break;
        case 10:
            d3.select('#lapGroupPath').selectAll('#lap10').remove();
            d3.select("#lapGroupPath").append("text")
                .attr("id", "lap10")
                .attr("class", "textDetails2")
                .attr("transform", "translate(327, 262) rotate(-7)")
                .attr("x", 0)
                .attr("y", 0)
                .text('10');
            break;
        default:
            break;
    }



}


function drawLaps(num) {
    if (!num) {
        return;
    }
    let laps = parseInt(num / 15);
    let blocks = num % 15;
    if (laps) {
        d3.select("#lapGroupPath").append("text")
            .attr("class", "lapDetails")
            .attr("x", 190)
            .attr("y", 200)
            .text(laps + (laps == 1 ? " Lap" : " Laps"));
    }


}

function genrateTemplate() {
    console.log('====================================');
    console.log('matrix', matrix);
    console.log('====================================');
    let array = ["60.00", "30.00", "20.00", "15.00", "12.00", "10.00", "8.30", "7.30", "6.40", "6.00", "5.30", "5.00", "4.35", "4.15", "4.00", "3.45", "3.30", "3.20", "3.10", "3.00"];
    let xpos = 35;
    let ypos = 1;
    let width = 80;
    let height = 80;
    for (let row = 20; row > 0; row--) {
        d3.select("#gridSVG").append("g").attr("id", "row_" + row);
        for (let col = 1; col < 11; col++) {
            let cellText = row + "/" + col;
            let cellId = row + "_" + col;
            let laps = parseInt((row * col) / 15);
            let sfText = (row * col) + "SF";
            let cell = findCellDetails(cellText);

            matrix[row][col] = {
                cell,
                cellId,
                row,
                col,
                pace: array[row - 1]
            }

            d3.select("#row_" + row).append("rect")
                .attr("id", "block-" + cellId)
                .attr("class", "square")
                .attr("x", xpos)
                .attr("y", ypos)
                .attr("width", width)
                .attr("height", height)
                .style("fill", cell.color)
                .style("stroke", "#222")
                .on("click", function() {


                    handleClickBlock(cell, cellId, row, col, array[row - 1]);
                });
            console.log('====================================');
            console.log("text-" + cellId, xpos + 12);
            console.log('====================================');
            d3.select("#row_" + row).append("text")
                .attr("id", "text-" + cellId)
                .attr("class", "cellText")
                .attr("x", xpos + 12)
                .attr("y", ypos + 50)
                .text(cellText)
                .on("click", function() {
                    handleClickBlock(cell, cellId, row, col, array[row - 1]);
                });
            d3.select("#row_" + row).append("text")
                .attr("id", "sf-" + cellId)
                .attr("class", "sfText")
                .attr("x", xpos + 2)
                .attr("y", ypos + 15)
                .text(sfText)
                .on("click", function() {
                    handleClickBlock(cell, cellId, row, col, array[row - 1]);
                });

            if (row == 20) {
                console.log("text-" + cellId, xpos + 12);
                d3.select("#row_" + row).append("text")
                    .attr("class", "svgHeaderLabel")
                    .attr("x", xpos + 32)
                    .attr("y", -5)
                    .text(11 - col);
            }

            if (row == 1) {
                console.log('====================================');
                console.log('ypos', ypos);
                console.log('====================================');
                console.log("text-" + cellId, xpos + 12);
                d3.select("#row_" + row).append("text")
                    .attr("class", "svgHeaderLabel")
                    .attr("x", xpos + 32)
                    .attr("y", ypos + 110)
                    .text(col);
            }

            xpos += width;
        }
        d3.select("#row_" + row).append("text")
            .attr("class", "svgSideLabel")
            .attr("x", 0)
            .attr("y", ypos + 50)
            .text(row);

        let pace = calcPaceValue(row);
        let { paceMin, paceSec } = pace;
        d3.select("#row_" + row).append("text")
            .attr("class", "svgSideLabel")
            .attr("x", 840)
            .attr("y", ypos + 50)
            .text(paceMin);
        d3.select("#row_" + row).append("text")
            .attr("class", "svgSideMiniLabel")
            .attr("x", paceMin > 9 ? 870 : 855)
            .attr("y", ypos + 35)
            .text(paceSec ? paceSec : "00");

        xpos = 35;
        ypos += height;
    }
    const squareElement = document.getElementsByClassName("square");
    const squareInfo = squareElement[0].getBoundingClientRect();
    const squareWidth = squareInfo.width
        // TODO ADjustment

    /* for (let col = 1; col < 11; col++) {
        const xTopPosition = (50 + (Math.round(squareWidth) / 2)) * (11 - col)
        console.log('====================================');
        console.log('xTopPosition', xTopPosition);
        console.log('====================================');
        d3.select("#repetitionNumbers").append("text")
            .attr("class", "svgHeaderLabel")
            .attr("x", xTopPosition)
            .attr("y", 55)
            .text(11 - col);

        const xDownPosition = Number(d3.select("#block-1_" + col)._groups[0][0].getAttribute('x')) + Number(d3.select("#block-1_" + col)._groups[0][0].getAttribute('width') / 2)
        d3.select("#runTimeLabelWrap").append("text")
            .attr("class", "svgFooterLabel")
            .attr("x", xDownPosition)
            .attr("y", 20)
            .text(col);
    }*/

    d3.select("#gridSVG").append("g").append("path")
        .attr("stroke", "#000")
        .attr("stroke-width", "4px")
        .attr("fill", "none")
        .attr("d", "M35 2 L35 1602 L835 1602 L835 2z");

    $('.chartDivWrap').animate({
        scrollTop: $("#lastScroll").offset().top
    }, 2000);

    addSpeedometer();
}
genrateTemplate();
initAnalog();

function reset() {
    $(".square").removeClass("semiHideCell");
    $(".square").removeClass("highlightGroupCell");
    $(".square").removeClass("selectedCell");
    d3.select('#nextCellPath').remove();
    d3.select('#lapGroupPath').selectAll('text').remove();
    d3.select('#lapGroupPath').selectAll('path').remove();
    initAnalog();
    resetSample();
    resetGenerator();
    initDetailsText()
}

function updateAnalog(row, col) {
    let array = ["60.00", "30.00", "20.00", "15.00", "12.00", "10.00", "8.30", "7.30", "6.40", "6.00", "5.30", "5.00", "4.35", "4.15", "4.00", "3.45", "3.30", "3.20", "3.10", "3.00"];

    let pace = calcPaceValue(row);
    let { paceValue } = pace;
    let paceAngle = paceValue * 6;
    let colAngle = col * 6;
    let speedAngle = 240 + (row * 12);
    if (speedAngle > 360) {
        speedAngle -= 360;
    }

    if (paceValue == 60) {
        d3.select("#face").attr("fill", "#ea2525");
    } else {
        d3.select("#face").attr("fill", "none");
        let paceArc = describeArc(50, 50, 45, 0, paceAngle);
        d3.select("#paceArc").attr("d", paceArc);
    }
    let colArc = describeArc(50, 50, 45, 0, colAngle);
    d3.select("#colArc").attr("d", colArc);

    if (toggleCSS.speedometer) {
        let speedArc = describeSpeedArc(50, 50, 28, 240, speedAngle);
        d3.select("#speedArc").attr("d", speedArc);
    }

    d3.select('#paceTimeText').selectAll('text').remove();
    if (toggleCSS.hideBlockNameClock) {
        console.log('====================================');
        console.log('speedFitDep', speedFitDep);
        console.log('====================================');
        let speedPosition = 40
        if (parseInt(speedFitDep.speed) > 9) {
            speedPosition = 32
        }

        let timePosition = 53
        if (parseInt(speedFitDep.time) > 9) {
            timePosition = 52
        }


        let pacePosition = 47
        if (parseInt(speedFitDep.pace) > 9) {
            pacePosition = 42
        }


        let pacePositionPow = 8
        if (parseInt(speedFitDep.pace) > 9) {
            pacePositionPow = 14
        }

        d3.select("#paceTimeText").append("text")
            .attr("class", "clockSFValueText numbers")
            .attr("x", speedPosition)
            .attr("y", 50)
            .text(speedFitDep.speed);

        d3.select("#paceTimeText").append("text")
            .attr("class", "clockSFValueText numbers")
            .attr("x", 49)
            .attr("y", 50)
            .text("/");
        d3.select("#paceTimeText").append("text")
            .attr("class", "clockSFValueText numbers")
            .attr("x", timePosition)
            .attr("y", 50)
            .text(speedFitDep.time);


        d3.select("#paceTimeText").append("text")
            .attr("class", "timeValueText")
            .attr("x", 37)
            .attr("y", 58)
            .text("SPEED /");
        d3.select("#paceTimeText").append("text")
            .attr("class", "timeValueText")
            .attr("x", 53)
            .attr("y", 58)
            .text("TIME");

        const paceInt = parseInt(speedFitDep.pace)
        const paceFloat = speedFitDep.pace + ''
        console.log('====================================');
        console.log('paceFloat', paceFloat);
        console.log('====================================');
        const paceRest = paceFloat.substr(paceFloat.indexOf('.') + 1, 2)

        d3.select("#paceTimeText").append("text")
            .attr("class", "clockSFValueText numbersPace")
            .attr("x", pacePosition)
            .attr("y", 71)
            .text(paceInt);

        d3.select("#paceTimeText").append("text")
            .attr("class", "clockSFValueText paceRest  numbersPace")
            .attr("x", pacePosition + pacePositionPow)
            .attr("y", 65)
            .text(paceRest.length == 1 ? paceRest + '0' : paceRest);


        d3.select("#paceTimeText").append("text")
            .attr("class", "timeValueText")
            .attr("x", 45)
            .attr("y", 79)
            .text("PACE");


        /** */


        d3.select("#samplepaceTimeText").append("text")
            .attr("class", "sampleclockSFValueText numbers")
            .attr("x", speedPosition)
            .attr("y", 50)
            .text(speedFitDep.speed);
        d3.select("#samplepaceTimeText").append("text")
            .attr("class", "sampleclockSFValueText numbers")
            .attr("x", 49)
            .attr("y", 50)
            .text("/");
        d3.select("#samplepaceTimeText").append("text")
            .attr("class", "sampleclockSFValueText numbers")
            .attr("x", timePosition)
            .attr("y", 50)
            .text(speedFitDep.time);
        d3.select("#samplepaceTimeText").append("text")
            .attr("class", "timeValueText")
            .attr("x", 37)
            .attr("y", 58)
            .text("SPEED /");
        d3.select("#samplepaceTimeText").append("text")
            .attr("class", "timeValueText")
            .attr("x", 53)
            .attr("y", 58)
            .text("TIME");



        d3.select("#samplepaceTimeText").append("text")
            .attr("class", "sampleclockSFValueText numbersPace")
            .attr("x", pacePosition)
            .attr("y", 71)
            .text(paceInt);

        d3.select("#samplepaceTimeText").append("text")
            .attr("class", "sampleclockSFValueText numbersPace paceRest")
            .attr("x", pacePosition + pacePositionPow)
            .attr("y", 65)
            .text(paceRest.length == 1 ? paceRest + '0' : paceRest);

        d3.select("#samplepaceTimeText").append("text")
            .attr("class", "timeValueText")
            .attr("x", 45)
            .attr("y", 79)
            .text("PACE");


        d3.select("#paceTimeText").append("text")
            .attr("class", "clockSFValueText arrows")
            .attr("x", 47)
            .attr("y", 62.5)
            .text("▲")
            .on("click", function() {

                addPace('up')
            });

        d3.select("#paceTimeText").append("text")
            .attr("class", "clockSFValueText arrows")
            .attr("x", 47)
            .attr("y", 74.7)
            .text("▼")
            .on("click", function() {
                addPace('down')

            });

        d3.select("#paceTimeText").append("text")
            .attr("class", "clockSFValueText arrows")
            .attr("x", 54.5)
            .attr("y", 41)
            .text("▲")
            .on("click", function() {
                addTime('up')
            });
        d3.select("#paceTimeText").append("text")
            .attr("class", "clockSFValueText arrows")
            .attr("x", 54.5)
            .attr("y", 54)
            .text("▼")
            .on("click", function() {
                addTime('down')
            });

        d3.select("#paceTimeText").append("text")
            .attr("class", "clockSFValueText arrows")
            .attr("x", 41.5)
            .attr("y", 41)
            .text("▲")
            .on("click", function() {
                addSpeed('up')
            });
        d3.select("#paceTimeText").append("text")
            .attr("class", "clockSFValueText arrows")
            .attr("x", 41.5)
            .attr("y", 54)
            .text("▼")
            .on("click", function() {
                addSpeed('down')
            });

        /*
                d3.select("#paceTimeText").append("text")
                    .attr("class", "clockSFValueText numbers")
                    .attr("x", xPaceTime)
                    .attr("y", 50)
                    .text(row + "/" + col);
                d3.select("#paceTimeText").append("text")
                    .attr("class", "paceValueText")
                    .attr("x", 35)
                    .attr("y", 56)
                    .text("SPEED /");
                d3.select("#paceTimeText").append("text")
                    .attr("class", "timeValueText")
                    .attr("x", 52)
                    .attr("y", 56)
                    .text("TIME");

                d3.select("#paceTimeText").append("text")
                    .attr("class", "clockSFValueText numbers")
                    .attr("x", 32)
                    .attr("y", 70)
                    .text(array[row]);

                d3.select("#paceTimeText").append("text")
                    .attr("class", "timeValueText")
                    .attr("x", 45)
                    .attr("y", 76)
                    .text("PACE");*/
    } else {
        d3.select("#paceTimeText").append("text")
            .attr("class", "paceValueText")
            .attr("x", 38)
            .attr("y", 55)
            .text("PACE/");
        d3.select("#paceTimeText").append("text")
            .attr("class", "timeValueText")
            .attr("x", 53)
            .attr("y", 55)
            .text("TIME");
    }
}

function addSpeed(type) {
    let cell1, cellId1, row1, col1, time1;

    let speed = parseInt(speedFitDep.speed)
    let timecol = parseInt(speedFitDep.time)

    if (!timecol) {
        timecol = 1
    }
    console.log('===============matrix=====================');
    console.log('matrix', matrix);
    console.log('====================================');
    if (type === 'up') {

        console.log('====================================');
        console.log('matrix[speed + 1][timecol]', speed, timecol, matrix[speed + 1], matrix[speed + 1][timecol]);
        console.log('====================================');

        let speedRow = speed + 1
        if (speedRow > 20) {
            speedRow = 20
        }
        cell1 = matrix[speedRow][timecol].cell
        cellId1 = matrix[speedRow][timecol].cellId
        row1 = matrix[speedRow][timecol].row
        col1 = matrix[speedRow][timecol].col
        time1 = matrix[speedRow][timecol].pace

        console.log('==================================== cell1, cellId1, row1, col1, time1 up');
        console.log(cell1, cellId1, row1, col1, time1);
        console.log('====================================');
        handleClickBlock(cell1, cellId1, row1, col1, time1)
    }

    if (type === 'down') {

        console.log('====================================');
        console.log('matrix[speed - 1][timecol]', speed, timecol, matrix[speed - 1], matrix[speed - 1][timecol]);
        console.log('====================================');

        let speedRow = speed - 1
        console.log('====================================');
        console.log();
        console.log('====================================');
        if (speedRow >= 1) {
            cell1 = matrix[speedRow][timecol].cell
            cellId1 = matrix[speedRow][timecol].cellId
            row1 = matrix[speedRow][timecol].row
            col1 = matrix[speedRow][timecol].col
            time1 = matrix[speedRow][timecol].pace
            console.log('==================================== cell1, cellId1, row1, col1, time1 down');
            console.log(cell1, cellId1, row1, col1, time1);
            console.log('====================================');
            handleClickBlock(cell1, cellId1, row1, col1, time1)
        }

    }

}

function addTime(type) {
    let cell1, cellId1, row1, col1, time1;

    let speed = parseInt(speedFitDep.speed)
    let timecol = parseInt(speedFitDep.time)

    if (!speed) {
        speed = 1
    }
    console.log('===============matrix=====================');
    console.log('matrix', matrix);
    console.log('====================================');
    if (type === 'up') {

        console.log('====================================');
        console.log('matrix[speed][timeColo]', speed, timecol, matrix[speed], matrix[speed][timecol + 1]);
        console.log('====================================');

        let timeColo = timecol + 1
        if (timeColo > 10) {
            timeColo = 10
        }
        cell1 = matrix[speed][timeColo].cell
        cellId1 = matrix[speed][timeColo].cellId
        row1 = matrix[speed][timeColo].row
        col1 = matrix[speed][timeColo].col
        time1 = matrix[speed][timeColo].pace

        console.log('==================================== cell1, cellId1, row1, col1, time1 Timeup');
        console.log(cell1, cellId1, row1, col1, time1);
        console.log('====================================');
        handleClickBlock(cell1, cellId1, row1, col1, time1)
    }

    if (type === 'down') {

        console.log('====================================');
        console.log('matrix[speed][timecol -1]', speed, timecol, matrix[speed], matrix[speed][timecol - 1]);
        console.log('====================================');

        let timeColo = timecol - 1
        console.log('====================================');
        console.log();
        console.log('====================================');
        if (timeColo >= 1) {
            cell1 = matrix[speed][timeColo].cell
            cellId1 = matrix[speed][timeColo].cellId
            row1 = matrix[speed][timeColo].row
            col1 = matrix[speed][timeColo].col
            time1 = matrix[speed][timeColo].pace
            console.log('==================================== cell1, cellId1, row1, col1, time1 Timedown');
            console.log(cell1, cellId1, row1, col1, time1);
            console.log('====================================');
            handleClickBlock(cell1, cellId1, row1, col1, time1)
        }

    }

}

function addPace(type) {
    let cell1, cellId1, row1, col1, time1;

    let speed = parseInt(speedFitDep.speed)
    let timecol = parseInt(speedFitDep.time)

    if (!timecol) {
        timecol = 1
    }


    console.log('===============matrix=====================');
    console.log('matrix', matrix);
    console.log('====================================');
    if (type === 'up') {

        let speedRow = speed + 1
        if (speedRow > 20) {
            speedRow = 20
        }
        cell1 = matrix[speedRow][timecol].cell
        cellId1 = matrix[speedRow][timecol].cellId
        row1 = matrix[speedRow][timecol].row
        col1 = matrix[speedRow][timecol].col
        time1 = matrix[speedRow][timecol].pace

        console.log('==================================== cell1, cellId1, row1, col1, time1 up');
        console.log(cell1, cellId1, row1, col1, time1);
        console.log('====================================');
        handleClickBlock(cell1, cellId1, row1, col1, time1)
    }

    if (type === 'down') {

        let speedRow = speed - 1
        if (speedRow <= 0) {
            speedRow = 0
        }
        console.log('====================================');
        console.log();
        console.log('====================================');
        if (speedRow >= 1) {
            cell1 = matrix[speedRow][timecol].cell
            cellId1 = matrix[speedRow][timecol].cellId
            row1 = matrix[speedRow][timecol].row
            col1 = matrix[speedRow][timecol].col
            time1 = matrix[speedRow][timecol].pace
            console.log('==================================== cell1, cellId1, row1, col1, time1 down');
            console.log(cell1, cellId1, row1, col1, time1);
            console.log('====================================');
            handleClickBlock(cell1, cellId1, row1, col1, time1)
        }

    }
}

function initSVGAnalog() {
    d3.select("#paceTimeText").append("text")
        .attr("class", "clockSFValueText numbers")
        .attr("x", 40)
        .attr("y", 50)
        .text("0");

    d3.select("#paceTimeText").append("text")
        .attr("class", "clockSFValueText numbers")
        .attr("x", 49)
        .attr("y", 50)
        .text("/");
    d3.select("#paceTimeText").append("text")
        .attr("class", "clockSFValueText numbers")
        .attr("x", 53)
        .attr("y", 50)
        .text("0");

    d3.select("#paceTimeText").append("text")
        .attr("class", "paceValueText")
        .attr("x", 37)
        .attr("y", 58)
        .text("SPEED /");
    d3.select("#paceTimeText").append("text")
        .attr("class", "timeValueText")
        .attr("x", 53)
        .attr("y", 58)
        .text("TIME");
    d3.select("#paceTimeText").append("text")
        .attr("class", "clockSFValueText numbersPace")
        .attr("x", 46)
        .attr("y", 71)
        .text("0");

    d3.select("#paceTimeText").append("text")
        .attr("class", "timeValueText")
        .attr("x", 45)
        .attr("y", 79)
        .text("PACE");


    d3.select("#paceTimeText").append("text")
        .attr("class", "clockSFValueText arrows")
        .attr("x", 47)
        .attr("y", 62.5)
        .text("▲")
        .on("click", function() {
            console.log('====================================');
            console.log('down');
            console.log('====================================');

            addPace('up')

        });

    d3.select("#paceTimeText").append("text")
        .attr("class", "clockSFValueText arrows")
        .attr("x", 47)
        .attr("y", 74.7)
        .text("▼")
        .on("click", function() {

            console.log('====================================');
            console.log('up');
            console.log('====================================');
            addPace('down')
        });


    d3.select("#paceTimeText").append("text")
        .attr("class", "clockSFValueText arrows")
        .attr("x", 54.5)
        .attr("y", 41)
        .text("▲")
        .on("click", function() {
            addTime('up')
        });
    d3.select("#paceTimeText").append("text")
        .attr("class", "clockSFValueText arrows")
        .attr("x", 54.5)
        .attr("y", 54)
        .text("▼")
        .on("click", function() {
            addTime('down')
        });


    d3.select("#paceTimeText").append("text")
        .attr("class", "clockSFValueText arrows")
        .attr("x", 41.5)
        .attr("y", 41)
        .text("▲")
        .on("click", function() {
            addSpeed('up')
        });
    d3.select("#paceTimeText").append("text")
        .attr("class", "clockSFValueText arrows")
        .attr("x", 41.5)
        .attr("y", 54)
        .text("▼")
        .on("click", function() {
            addSpeed('down')
        });
}

function initAnalog(row, col) {
    d3.select("#face").attr("fill", "#ea2525");
    d3.select("#paceArc").attr("d", "");
    d3.select("#colArc").attr("d", "");
    d3.select("#speedArc").attr("d", "");
    // d3.select('#analogText').selectAll('text').remove();
    document.getElementById('inputSP').value = 0
    d3.select('#paceTimeText').selectAll('text').remove();
    if (toggleCSS.hideBlockNameClock) {
        initSVGAnalog()
    } else {
        d3.select("#paceTimeText").append("text")
            .attr("class", "paceValueText")
            .attr("x", 38)
            .attr("y", 55)
            .text("PACE/");
        d3.select("#paceTimeText").append("text")
            .attr("class", "timeValueText")
            .attr("x", 53)
            .attr("y", 55)
            .text("TIME");
    }
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    var d = [
        "M", x, y,
        "L", start.x, start.y,
        "A", radius, radius, 0, 0, 0, end.x, end.y,
        "z"
    ].join(" ");
    return d;
}

function describeSpeedArc(x, y, radius, startAngle, endAngle) {
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);
    if (endAngle > 60 && endAngle < 180) {
        var mid = polarToCartesian(x, y, radius, 60);
        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, 0, 0, mid.x, mid.y,
            "L", mid.x, mid.y,
            "A", radius, radius, 0, 0, 0, end.x, end.y,
        ].join(" ");
    } else {
        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, 0, 0, end.x, end.y,
        ].join(" ");
    }
    return d;
}


// Toggle Sidebar
let isSidebarOpen = false;

function toggleSidebar() {
    let { menuOptions } = toggleCSS;
    switch (menuOptions) {
        case 'adjustWidth':
            if (isSidebarOpen) {
                document.getElementById("mySidenav").style.width = "0";
                document.getElementById("main").style.width = "100%";
                document.getElementById("main").style.float = "right";
                isSidebarOpen = false;
            } else {
                document.getElementById("mySidenav").style.width = "270px";
                document.getElementById("main").style.width = "calc(100% - 270px)";
                document.getElementById("main").style.float = "right";
                isSidebarOpen = true;
            }
            break;
        case 'openOnTop':
            if (isSidebarOpen) {
                document.getElementById("mySidenav").style.width = "0";
                document.getElementById("main").style.float = "none";
                isSidebarOpen = false;
            } else {
                document.getElementById("mySidenav").style.width = "270px";
                document.getElementById("main").style.float = "none";
                isSidebarOpen = true;
            }
            break;
        case 'pushContent':
            if (isSidebarOpen) {
                document.getElementById("mySidenav").style.width = "0";
                document.getElementById("main").style.marginLeft = "0";
                document.getElementById("main").style.float = "none";
                isSidebarOpen = false;
            } else {
                document.getElementById("mySidenav").style.width = "270px";
                document.getElementById("main").style.marginLeft = "270px";
                document.getElementById("main").style.float = "none";
                isSidebarOpen = true;
            }
            break;
    }
}

// Toggle CSS
function handleChange(key) {
    toggleCSS[key] = !toggleCSS[key];
    resetAll();
}

function handleMenuOptions() {
    toggleSidebar();
    toggleCSS.menuOptions = $("#selectMenu").val();
}

function handleArrowOptions() {
    toggleCSS.arrowOptions = $("#selectArrow").val();

    resetAll();
}

function handleSpeedmeterToggle() {
    let { speedometer } = toggleCSS;
    toggleCSS.speedometer = !speedometer;
    if (toggleCSS.speedometer) {
        addSpeedometer();
    } else {
        d3.select('#speedTicks').selectAll('line').remove();
        d3.select('#speedNumbers').selectAll('path').remove();
        d3.select('#speedNumbers').selectAll('text').remove();

        d3.select('#samplespeedTicks').selectAll('line').remove();
        d3.select('#samplespeedNumbers').selectAll('path').remove();
        d3.select('#samplespeedNumbers').selectAll('text').remove();
    }
    reset();
}

function addSpeedometer() {
    d3.select("#speedTicks").append("line")
        .attr("x1", "26")
        .attr("y1", "64")
        .attr("x2", "27")
        .attr("y2", "63.5")
    d3.select("#speedTicks").append("line")
        .attr("x1", "26.5")
        .attr("y1", "36")
        .attr("x2", "27.8")
        .attr("y2", "36.5")
    d3.select("#speedTicks").append("line")
        .attr("x1", "50")
        .attr("y1", "22")
        .attr("x2", "50")
        .attr("y2", "24")
    d3.select("#speedTicks").append("line")
        .attr("x1", "72.5")
        .attr("y1", "36.7")
        .attr("x2", "74")
        .attr("y2", "35.7")
    d3.select("#speedTicks").append("line")
        .attr("x1", "73")
        .attr("y1", "63.5")
        .attr("x2", "74")
        .attr("y2", "64")
    d3.select("#speedNumbers").append("path")
        .attr("id", "speedRef")
        .attr("d", "M 74.24871130596429 64 A 28 28 0 0 0 74.24871130596429 36 L 74.24871130596429 36 A 28 28 0 0 0 25.751288694035715 64")
        .text(20);
    d3.select("#speedNumbers").append("text")
        .attr("x", 30)
        .attr("y", 65)
        .text(0);
    d3.select("#speedNumbers").append("text")
        .attr("x", 30)
        .attr("y", 40)
        .text(5);
    d3.select("#speedNumbers").append("text")
        .attr("x", 50)
        .attr("y", 30)
        .text(10);
    d3.select("#speedNumbers").append("text")
        .attr("x", 68)
        .attr("y", 40)
        .text(15);
    d3.select("#speedNumbers").append("text")
        .attr("x", 68)
        .attr("y", 65)
        .text(20);



    d3.select("#samplespeedTicks").append("line")
        .attr("x1", "26")
        .attr("y1", "64")
        .attr("x2", "27")
        .attr("y2", "63.5")
    d3.select("#samplespeedTicks").append("line")
        .attr("x1", "26.5")
        .attr("y1", "36")
        .attr("x2", "27.8")
        .attr("y2", "36.5")
    d3.select("#samplespeedTicks").append("line")
        .attr("x1", "50")
        .attr("y1", "22")
        .attr("x2", "50")
        .attr("y2", "24")
    d3.select("#samplespeedTicks").append("line")
        .attr("x1", "72.5")
        .attr("y1", "36.7")
        .attr("x2", "74")
        .attr("y2", "35.7")
    d3.select("#samplespeedTicks").append("line")
        .attr("x1", "73")
        .attr("y1", "63.5")
        .attr("x2", "74")
        .attr("y2", "64")
    d3.select("#samplespeedNumbers").append("path")
        .attr("id", "samplespeedRef")
        .attr("d", "M 74.24871130596429 64 A 28 28 0 0 0 74.24871130596429 36 L 74.24871130596429 36 A 28 28 0 0 0 25.751288694035715 64")
        .text(20);
    d3.select("#samplespeedNumbers").append("text")
        .attr("x", 30)
        .attr("y", 65)
        .text(0);
    d3.select("#samplespeedNumbers").append("text")
        .attr("x", 30)
        .attr("y", 40)
        .text(5);
    d3.select("#samplespeedNumbers").append("text")
        .attr("x", 50)
        .attr("y", 30)
        .text(10);
    d3.select("#samplespeedNumbers").append("text")
        .attr("x", 68)
        .attr("y", 40)
        .text(15);
    d3.select("#samplespeedNumbers").append("text")
        .attr("x", 68)
        .attr("y", 65)
        .text(20);
}

// clock for sameple watch
// function startTime() {
//   var today = new Date();
//   var h = today.getHours();
//   var m = today.getMinutes();
//   var s = today.getSeconds();
//   m = checkTime(m);
//   s = checkTime(s);
//   document.getElementById('sampleWatchClock').innerHTML =
//   h + ":" + m;
//   var t = setTimeout(startTime, 1000);
// }
// function checkTime(i) {
//   if (i < 10) {i = "0" + i};
//   return i;
// }
// startTime();

function drawSampleBlocks(row, col, possibleNeighbourCells, selectedCellId) {
    let array = ["60.00", "30.00", "20.00", "15.00", "12.00", "10.00", "8.30", "7.30", "6.40", "6.00", "5.30", "5.00", "4.35", "4.15", "4.00", "3.45", "3.30", "3.20", "3.10", "3.00"];

    drawSampleLaps(row * col);
    updateSampleAnalog(row, col);
    d3.select("#sampleBlocks").selectAll("rect").remove();
    d3.select("#sampleBlocks").selectAll("text").remove();
    let neighbourCells = [{
            name: "topLeft",
            value: (row + 1) + "/" + (col - 1)
        },
        {
            name: "topCenter",
            value: (row + 1) + "/" + (col)
        },
        {
            name: "topRight",
            value: (row + 1) + "/" + (col + 1)
        },
        {
            name: "left",
            value: row + "/" + (col - 1)
        },
        {
            name: "center",
            value: row + "/" + col
        },
        {
            name: "right",
            value: row + "/" + (col + 1)
        },
        {
            name: "bottomLeft",
            value: (row - 1) + "/" + (col - 1)
        },
        {
            name: "bottomCenter",
            value: (row - 1) + "/" + (col)
        },
        {
            name: "bottomRight",
            value: (row - 1) + "/" + (col + 1)
        }
    ];
    let xpos = 1;
    let ypos = 1;
    let width = 80;
    let height = 80;
    forEach(neighbourCells, function(cell) {
        let { name, value } = cell;
        let cellObj = findCellDetails(value);
        let valueSplit = value.split('/');
        let row = parseInt(valueSplit[0]);
        let col = parseInt(valueSplit[1]);
        let cellId = row + "_" + col;
        let sfText = (row * col) + "SF";
        let isValid = true;
        if (!row || !col || row > 20 || col > 10) {
            isValid = false;
        }



        if (isValid) {



            d3.select("#sampleBlocks").append("rect")
                .attr("class", "square" + (name == "center" ? " selectedSampleCell" : ""))
                .attr("id", "sampleblock-" + cellId)
                .attr("x", xpos)
                .attr("y", ypos)
                .attr("width", width)
                .attr("height", height)
                .style("fill", cellObj.color)
                .style("stroke", "#222")
                .on("click", function() {
                    handleClickBlock(cellObj, cellId, row, col, array[row]);
                });
            d3.select("#sampleBlocks").append("text")
                .attr("id", "sampletext-" + cellId)
                .attr("class", "cellText")
                .attr("x", xpos + 12)
                .attr("y", ypos + 50)
                .text(value)
                .on("click", function() {
                    handleClickBlock(cellObj, cellId, row, col, array[row]);
                });
            d3.select("#sampleBlocks").append("text")
                .attr("id", "samplesf-" + cellId)
                .attr("class", "sfText")
                .attr("x", xpos + 2)
                .attr("y", ypos + 15)
                .text(sfText)
                .on("click", function() {

                    handleClickBlock(cellObj, cellId, row, col, array[row]);
                });
        } else {
            d3.select("#sampleBlocks").append("rect")
                .attr("id", "sampleblock-" + cellId)
                .attr("x", xpos)
                .attr("y", ypos)
                .attr("width", width)
                .attr("height", height)
                .style("fill", cellObj.color)
                .style("stroke", "#000");
            let lable = "";
            let isPace = false;
            if (!col && row && row < 21) {
                lable = row;
            } else if (!row && col && col < 11) {
                lable = col;
            } else if (row > 20 && col && col < 11) {
                lable = 11 - col;
            } else if (col > 10 && row && row < 21) {
                let pace = calcPaceValue(row);
                let { paceMin, paceSec } = pace;
                lable = paceMin;
                isPace = true;
                d3.select("#sampleBlocks").append("text")
                    .attr("id", "sampletextMini-" + cellId)
                    .attr("class", "sampletextMini")
                    .attr("x", xpos + (paceMin > 9 ? 34 : 25))
                    .attr("y", ypos + 30)
                    .text(paceSec ? paceSec : "00");
            }
            d3.select("#sampleBlocks").append("text")
                .attr("id", "sampletext-" + cellId)
                .attr("class", "cellText")
                .attr("x", xpos + (isPace ? 10 : 25))
                .attr("y", ypos + 50)
                .text(lable);
        }
        xpos += width;
        if (xpos > 240) {
            xpos = 1;
            ypos += height;
        }
    });
    let sampleSelectedCellId = "#sample" + selectedCellId.substr(1);
    d3.select('#sampleNextCellPath').remove();
    d3.select("#sampleBlocks").append("g").attr("id", "sampleNextCellPath");
    let scv = {
        x: parseInt(d3.select(sampleSelectedCellId).attr('x')),
        y: parseInt(d3.select(sampleSelectedCellId).attr('y')),
        width: parseInt(d3.select(sampleSelectedCellId).attr('width')),
        height: parseInt(d3.select(sampleSelectedCellId).attr('height'))
    };
    let arrowArray = [];
    forEach(possibleNeighbourCells, function(neighbourCell) {
        let { name, value } = neighbourCell;
        let cellObj = findCellDetails(value);

        let valueSplit = value.split('/');
        let row = parseInt(valueSplit[0]);
        let col = parseInt(valueSplit[1]);
        let cellId = row + "_" + col;

        let sampleId = "#sample" + neighbourCell.id.substr(1);
        let ncv = {
            x: parseInt(d3.select(sampleId).attr('x')),
            y: parseInt(d3.select(sampleId).attr('y')),
            width: parseInt(d3.select(sampleId).attr('width')),
            height: parseInt(d3.select(sampleId).attr('height'))
        };
        let x1 = 0;
        let y1 = 0;
        let x2 = 0;
        let y2 = 0;
        let path = null;
        let ncSF = neighbourCell.row * neighbourCell.col;
        let ncLapValue = parseInt(ncSF / 15);
        let ncBlockVakue = ncSF % 15;
        let nclbValue = ncBlockVakue ? ncLapValue + "L/" + ncBlockVakue + "SF" : ncLapValue + "L";



        switch (neighbourCell.name) {
            case 'topLeft':
                x1 = scv.x + 20;
                y1 = scv.y + 20;
                x2 = ncv.x + ncv.width - 15;
                y2 = ncv.y + ncv.height - 10;
                d3.select("#sampleBlocks").append("text")
                    .attr("id", "nclb_8")
                    .attr("class", "nclbText")
                    .attr("x", ncv.x + 2)
                    .attr("y", ncv.y + 75)
                    .text(nclbValue)
                    .on("click", function() {


                        handleClickBlock(cellObj, cellId, row, col, array[row]);
                    });
                d3.select("#sampleNextCellPath").append("path")
                    .style("stroke", "#ff0078")
                    .style("stroke-width", "4")
                    .attr("id", "sap_8")
                    .attr("class", "arrowPathClass")
                    .attr("marker-end", "url(#sampleArrowHead)")
                    .attr("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);
                arrowArray.push(8);
                break;
            case 'topCenter':
                x1 = scv.x + (scv.width / 2);
                y1 = scv.y + 20;
                x2 = ncv.x + (ncv.width / 2);
                y2 = ncv.y + ncv.height - 5;
                d3.select("#sampleBlocks").append("text")
                    .attr("id", "nclb_1")
                    .attr("class", "nclbText")
                    .attr("x", ncv.x + 2)
                    .attr("y", ncv.y + 75)
                    .text(nclbValue)
                    .on("click", function() {

                        handleClickBlock(cellObj, cellId, row, col, array[row]);
                    });
                d3.select("#sampleNextCellPath").append("path")
                    .style("stroke", "#ff0078")
                    .style("stroke-width", "4")
                    .attr("id", "sap_1")
                    .attr("class", "arrowPathClass")
                    .attr("marker-end", "url(#sampleArrowHead)")
                    .attr("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);
                arrowArray.push(1);
                break;
            case 'topRight':
                x1 = scv.x + ncv.width - 20;
                y1 = scv.y + 20;
                x2 = ncv.x + 15;
                y2 = ncv.y + ncv.height - 10;
                d3.select("#sampleBlocks").append("text")
                    .attr("id", "nclb_2")
                    .attr("class", "nclbText")
                    .attr("x", ncv.x + 2)
                    .attr("y", ncv.y + 75)
                    .text(nclbValue)
                    .on("click", function() {

                        handleClickBlock(cellObj, cellId, row, col, array[row]);
                    });
                d3.select("#sampleNextCellPath").append("path")
                    .style("stroke", "#ff0078")
                    .style("stroke-width", "4")
                    .attr("id", "sap_2")
                    .attr("class", "arrowPathClass")
                    .attr("marker-end", "url(#sampleArrowHead)")
                    .attr("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);
                arrowArray.push(2);
                break;
            case 'left':
                x1 = scv.x + 5;
                y1 = scv.y + (scv.height / 2);
                x2 = ncv.x + ncv.width - 5;
                y2 = ncv.y + (ncv.height / 2);
                d3.select("#sampleBlocks").append("text")
                    .attr("id", "nclb_7")
                    .attr("class", "nclbText")
                    .attr("x", ncv.x + 2)
                    .attr("y", ncv.y + 75)
                    .text(nclbValue)
                    .on("click", function() {

                        handleClickBlock(cellObj, cellId, row, col, array[row]);
                    });
                d3.select("#sampleNextCellPath").append("path")
                    .style("stroke", "#ff0078")
                    .style("stroke-width", "4")
                    .attr("id", "sap_7")
                    .attr("class", "arrowPathClass")
                    .attr("marker-end", "url(#sampleArrowHead)")
                    .attr("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);
                arrowArray.push(7);
                break;
            case 'right':
                x1 = scv.x + scv.width - 5;
                y1 = scv.y + (scv.height / 2);
                x2 = ncv.x + 5;
                y2 = ncv.y + (ncv.height / 2);
                d3.select("#sampleBlocks").append("text")
                    .attr("id", "nclb_3")
                    .attr("class", "nclbText")
                    .attr("x", ncv.x + 2)
                    .attr("y", ncv.y + 75)
                    .text(nclbValue)
                    .on("click", function() {

                        handleClickBlock(cellObj, cellId, row, col, array[row]);
                    });
                d3.select("#sampleNextCellPath").append("path")
                    .style("stroke", "#ff0078")
                    .style("stroke-width", "4")
                    .attr("id", "sap_3")
                    .attr("class", "arrowPathClass")
                    .attr("marker-end", "url(#sampleArrowHead)")
                    .attr("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);
                arrowArray.push(3);
                break;
            case 'bottomLeft':
                x1 = scv.x + 20;
                y1 = scv.y + ncv.height - 20;
                x2 = ncv.x + ncv.width - 15;
                y2 = ncv.y + 15;
                d3.select("#sampleBlocks").append("text")
                    .attr("id", "nclb_6")
                    .attr("class", "nclbText")
                    .attr("x", ncv.x + 2)
                    .attr("y", ncv.y + 75)
                    .text(nclbValue)
                    .on("click", function() {

                        handleClickBlock(cellObj, cellId, row, col, array[row]);
                    });
                d3.select("#sampleNextCellPath").append("path")
                    .style("stroke", "#ff0078")
                    .style("stroke-width", "4")
                    .attr("id", "sap_6")
                    .attr("class", "arrowPathClass")
                    .attr("marker-end", "url(#sampleArrowHead)")
                    .attr("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);
                arrowArray.push(6);
                break;
            case 'bottomCenter':
                x1 = scv.x + (scv.width / 2);
                y1 = scv.y + ncv.height - 20;
                x2 = ncv.x + (ncv.width / 2);
                y2 = ncv.y + 15;
                d3.select("#sampleBlocks").append("text")
                    .attr("id", "nclb_5")
                    .attr("class", "nclbText")
                    .attr("x", ncv.x + 2)
                    .attr("y", ncv.y + 75)
                    .text(nclbValue)
                    .on("click", function() {

                        handleClickBlock(cellObj, cellId, row, col, array[row]);
                    });
                d3.select("#sampleNextCellPath").append("path")
                    .style("stroke", "#ff0078")
                    .style("stroke-width", "4")
                    .attr("id", "sap_5")
                    .attr("class", "arrowPathClass")
                    .attr("marker-end", "url(#sampleArrowHead)")
                    .attr("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);
                arrowArray.push(5);
                break;
            case 'bottomRight':
                x1 = scv.x + ncv.width - 20;
                y1 = scv.y + ncv.height - 20;
                x2 = ncv.x + 15;
                y2 = ncv.y + 15;
                d3.select("#sampleBlocks").append("text")
                    .attr("id", "nclb_4")
                    .attr("class", "nclbText")
                    .attr("x", ncv.x + 2)
                    .attr("y", ncv.y + 75)
                    .text(nclbValue)
                    .on("click", function() {

                        handleClickBlock(cellObj, cellId, row, col, array[row]);
                    });
                d3.select("#sampleNextCellPath").append("path")
                    .style("stroke", "#ff0078")
                    .style("stroke-width", "4")
                    .attr("id", "sap_4")
                    .attr("class", "arrowPathClass")
                    .attr("marker-end", "url(#sampleArrowHead)")
                    .attr("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);
                arrowArray.push(4);
                break;
        }
    });
    setArrowDisplay(arrowArray);
}

let blinkTimer = null;

function setArrowDisplay(arrowArray) {
    let { arrowOptions } = toggleCSS;
    $(".arrowPathClass").removeClass("displayNone");
    $(".nclbText").removeClass("displayNone");
    clearInterval(blinkTimer);
    switch (arrowOptions) {
        case 'blinkTogether':
            let display = 0;
            blinkTimer = setInterval(function() {
                if (display) {
                    $(".arrowPathClass").removeClass("displayNone");
                    $(".nclbText").removeClass("displayNone");
                    display = 0;
                } else {
                    $(".arrowPathClass").addClass("displayNone");
                    $(".nclbText").addClass("displayNone");
                    display = 1;
                }
            }, 700);
            break;
        case 'blinkClockWise':
            $(".arrowPathClass").addClass("displayNone");
            $(".nclbText").addClass("displayNone");
            arrowArray.sort();
            let count = 0;
            blinkTimer = setInterval(function() {
                $(".arrowPathClass").addClass("displayNone");
                $(".nclbText").addClass("displayNone");
                let sampleArrowID = "#sap_" + arrowArray[count];
                let arrowID = "#ap_" + arrowArray[count];
                let ncblTextID = "#nclb_" + arrowArray[count];
                $(sampleArrowID).removeClass("displayNone");
                $(arrowID).removeClass("displayNone");
                $(ncblTextID).removeClass("displayNone");
                count++;
                if (arrowArray.length <= count) {
                    count = 0;
                }
            }, 700);
            break;
        case 'blinkFillClockWise':
            $(".arrowPathClass").addClass("displayNone");
            $(".nclbText").addClass("displayNone");
            arrowArray.sort();
            let count2 = 0;
            blinkTimer = setInterval(function() {
                let sampleArrowID = "#sap_" + arrowArray[count2];
                let arrowID = "#ap_" + arrowArray[count2];
                let ncblTextID = "#nclb_" + arrowArray[count2];
                $(sampleArrowID).removeClass("displayNone");
                $(arrowID).removeClass("displayNone");
                $(ncblTextID).removeClass("displayNone");
                count2++;
                if (arrowArray.length < count2) {
                    count2 = 0;
                    $(".arrowPathClass").addClass("displayNone");
                    $(".nclbText").addClass("displayNone");
                }
            }, 700);
            break;
    }
}
defautldrawSampleLaps()

function defautldrawSampleLaps() {

    d3.select('#sampleLapGroupPath').selectAll('text').remove();
    d3.select('#sampleLapGroupPath').selectAll('path').remove();








    d3.select("#sampleLapGroupPath").append("text")
        .attr("class", "textDetails11")
        .attr("x", 0 >= 10 ? 180 : 205)
        .attr("y", 255)
        .text(0 + '');


    d3.select("#sampleLapGroupPath").append("text")
        .attr("class", "textDetails11")
        .attr("x", 240)
        .attr("y", 255)
        .text('/');


    d3.select("#sampleLapGroupPath").append("text")
        .attr("class", "textDetails11")
        .attr("x", 265)
        .attr("y", 255)
        .text(0 + '');

    d3.select("#sampleLapGroupPath").append("text")
        .attr("class", "textDetails11")
        .attr("x", 140)
        .attr("y", 500)
        .text('Pace');

    d3.select("#sampleLapGroupPath").append("text")
        .attr("class", "textDetails11")
        .attr("x", 265)
        .attr("y", 500)
        .text(0);

    d3.select("#sampleLapGroupPath").append("text")
        .attr("class", "textDetails11")
        .attr('id', 'numberOfSpeedFit')
        .attr("x", 50)
        .attr("y", 50)
        .text(0);

    d3.select("#sampleLapGroupPath").append("text")
        .attr("class", "textDetails11")
        .attr("x", 0 < 10 ? 80 : (0 < 100 ? 110 : 140))
        .attr("y", 50)
        .text('SF');



}

function drawSampleLaps(num) {

    d3.select('#sampleLapGroupPath').selectAll('text').remove();
    d3.select('#sampleLapGroupPath').selectAll('path').remove();

    const ellipsisNum = + ellipsisFitDep.speed * + ellipsisDep.time
    let laps = ellipsisNum / 15;


    const lapsInt = parseInt(ellipsisNum / 15)
    if (laps) {



        document.getElementById('inputSP').value = ellipsisNum



        d3.select("#sampleLapGroupPath").append("text")
            .attr("class", "textDetails11")
            .attr("x", ellipsisDep.speed >= 10 ? 180 : 205)
            .attr("y", 255)
            .text(ellipsisDep.speed + '');


        d3.select("#sampleLapGroupPath").append("text")
            .attr("class", "textDetails11")
            .attr("x", 240)
            .attr("y", 255)
            .text('/');


        d3.select("#sampleLapGroupPath").append("text")
            .attr("class", "textDetails11")
            .attr("x", 265)
            .attr("y", 255)
            .text(ellipsisDep.time + '');




        const paceInt = parseInt(ellipsisDep.pace)
        const paceFloat = ellipsisDep.pace + ''
        console.log('====================================');
        console.log('paceFloat', paceFloat);
        console.log('====================================');
        const paceRest = paceFloat.substr(paceFloat.indexOf('.') + 1, 2)


        d3.select("#sampleLapGroupPath").append("text")
            .attr("class", "textDetails11")
            .attr("x", 140)
            .attr("y", 500)
            .text('Pace');

        d3.select("#sampleLapGroupPath").append("text")
            .attr("class", "textDetails11")
            .attr("x", 265)
            .attr("y", 500)
            .text(paceInt);

        d3.select("#sampleLapGroupPath").append("text")
            .attr("class", "textDetails12")
            .attr("x", paceInt >= 10 ? 320 : 295)
            .attr("y", 470)
            .text(paceRest);
        /*
                d3.select("#sampleLapGroupPath").append("text")
                    .attr("class", "textDetails")
                    .attr("x", 295)
                    .attr("y", 320)
                    .text(lapsInt);

                d3.select("#sampleLapGroupPath").append("text")
                    .attr("class", "textDetails")
                    .attr("x", 315)
                    .attr("y", 320)
                    .text('LP');*/

        d3.select("#sampleLapGroupPath").append("text")
            .attr("class", "textDetails11")
            .attr('id', 'numberOfEllipsis')
            .attr("x", 50)
            .attr("y", 50)
            .text(ellipsisNum);

        d3.select("#sampleLapGroupPath").append("text")
            .attr("class", "textDetails11")
            .attr("x", ellipsisNum < 10 ? 80 : (ellipsisNum < 100 ? 110 : 140))
            .attr("y", 50)
            .text('SF');
    }


}

function updateSampleAnalog(row, col) {
    let array = ["60.00", "30.00", "20.00", "15.00", "12.00", "10.00", "8.30", "7.30", "6.40", "6.00", "5.30", "5.00", "4.35", "4.15", "4.00", "3.45", "3.30", "3.20", "3.10", "3.00"];

    let pace = calcPaceValue(row);
    let { paceValue } = pace;
    let paceAngle = paceValue * 6;
    let colAngle = col * 6;
    let speedAngle = 240 + (row * 12);
    if (speedAngle > 360) {
        speedAngle -= 360;
    }

    if (paceValue == 60) {
        d3.select("#sampleface").attr("fill", "#ea2525");
    } else {
        d3.select("#sampleface").attr("fill", "none");
        let paceArc = describeArc(50, 50, 45, 0, paceAngle);
        d3.select("#samplepaceArc").attr("d", paceArc);
    }
    let colArc = describeArc(50, 50, 45, 0, colAngle);
    d3.select("#samplecolArc").attr("d", colArc);

    if (toggleCSS.speedometer) {
        let speedArc = describeSpeedArc(50, 50, 28, 240, speedAngle);
        d3.select("#samplespeedArc").attr("d", speedArc);
    }

    d3.select('#samplepaceTimeText').selectAll('text').remove();
    if (toggleCSS.hideBlockNameClock) {
        let xPaceTime = 38;
        if (row > 9 && col > 9) {
            xPaceTime = 28;
        } else if (row > 9 || col > 9) {
            xPaceTime = 33;
        }
        d3.select("#paceTimeText").append("text")
            .attr("class", "clockSFValueText")
            .attr("x", xPaceTime)
            .attr("y", 50)
            .text(row + "/" + col);
        d3.select("#paceTimeText").append("text")
            .attr("class", "paceValueText")
            .attr("x", 35)
            .attr("y", 56)
            .text("SPEED /");
        d3.select("#paceTimeText").append("text")
            .attr("class", "timeValueText")
            .attr("x", 52)
            .attr("y", 56)
            .text("TIME");

        d3.select("#paceTimeText").append("text")
            .attr("class", "clockSFValueText")
            .attr("x", 32)
            .attr("y", 70)
            .text(array[row]);

        d3.select("#paceTimeText").append("text")
            .attr("class", "timeValueText")
            .attr("x", 45)
            .attr("y", 76)
            .text("PACE");
    } else {
        d3.select("#samplepaceTimeText").append("text")
            .attr("class", "paceValueText")
            .attr("x", 38)
            .attr("y", 55)
            .text("PACE/");
        d3.select("#samplepaceTimeText").append("text")
            .attr("class", "timeValueText")
            .attr("x", 53)
            .attr("y", 55)
            .text("TIME");
    }
}

function resetSample() {
    d3.select("#sampleBlocks").selectAll("rect").remove();
    d3.select("#sampleBlocks").selectAll("text").remove();

    d3.select('#sampleNextCellPath').remove();
    d3.select('#samplelapGroupPath').selectAll('text').remove();
    d3.select('#samplelapGroupPath').selectAll('path').remove();
    initSampleAnalog();
}

function initSampleAnalog(row, col) {
    d3.select("#sampleface").attr("fill", "#ea2525");
    d3.select("#samplepaceArc").attr("d", "");
    d3.select("#samplecolArc").attr("d", "");
    d3.select("#samplespeedArc").attr("d", "");
    d3.select('#samplepaceTimeText').selectAll('text').remove();
    if (toggleCSS.hideBlockNameClock) {
        initSVGAnalog()
    } else {
        d3.select("#samplepaceTimeText").append("text")
            .attr("class", "paceValueText")
            .attr("x", 38)
            .attr("y", 55)
            .text("PACE/");
        d3.select("#samplepaceTimeText").append("text")
            .attr("class", "timeValueText")
            .attr("x", 53)
            .attr("y", 55)
            .text("TIME");
    }
}

let startX = 0,
    startY = 0
let drag = d3.drag()
    .on('start', function(d) {
        d3.event.sourceEvent.stopPropagation();
        startX = d3.event.x;
        startY = d3.event.y;
    })
    .on('end', function(d) {
        let { x, y } = d3.event;
        dx = x - startX;
        dy = Math.abs(y - startY);
        if (dy < 20) {
            if (dx > 50) {
                rightSwipe();
            } else if (dx < -50) {
                leftSwipe();
            }
        }
    });

function swipefunc() {
    d3.select("#sampleBlockSVG").call(drag);
    d3.select("#sampleSpeedometer").call(drag);
    d3.select("#sampleLapSVG").call(drag);
}
swipefunc();

let sampleView = 1;

function leftSwipe() {
    if (sampleView < 3) {
        ++sampleView;
        displayView();
    }
}

function rightSwipe() {
    if (sampleView > 1) {
        --sampleView;
        displayView();
    }
}

function displayView() {
    switch (sampleView) {
        case 1:
            $("#sampleBlockSVG").removeClass("displayNone");
            $("#sampleSpeedometer").addClass("displayNone");
            $("#sampleLapSVG").addClass("displayNone");
            break;
        case 2:
            $("#sampleBlockSVG").addClass("displayNone");
            $("#sampleSpeedometer").removeClass("displayNone");
            $("#sampleLapSVG").addClass("displayNone");
            break;
        case 3:
            $("#sampleBlockSVG").addClass("displayNone");
            $("#sampleSpeedometer").addClass("displayNone");
            $("#sampleLapSVG").removeClass("displayNone");
            break;
    }
}