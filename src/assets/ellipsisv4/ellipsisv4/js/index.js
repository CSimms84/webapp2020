let { find, isEmpty, forEach, round, filter, indexOf, floor } = _;
let dataObj = [
	{
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
	if(isEmpty(cell)) {
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
	let pace = array[speed-1];
	let paceDivide = pace.split(".");
	let paceMin = parseInt(paceDivide[0]);
	let paceSec = parseInt(paceDivide[1]);
	let paceValue = paceMin + (paceSec / 60);
	return { paceValue, paceMin, paceSec };
}
function handleClickBlock(cell, cellId, row, col) {
	selectBlock(cell, cellId, row, col);
	addDetailsText(cellId, row, col);
	updateAnalog(row, col);
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
	let	selectedGroupArray = null;
	if(!isEmpty(selectedGroup)) {
		selectedGroupArray = selectedGroup.group;
		if(toggleCSS.highlightSelectedGroup) {
			for(let row = 20; row > 0; row--) {
				for(let col = 1; col < 11; col++) {
					let checkValue = row + "/" + col;
					if(selectedGroupArray.indexOf(checkValue) == -1) {
						let highlightCellId = row + "_" + col;
						$("#block-" + highlightCellId).addClass("highlightGroupCell");
					}
				}
			}
		}
	}

	let belowGroupArray = null;
	if(selectedGroupIndex > 0) {
		let belowGroupIndex = parseInt(nameIndex[1] - 2);
		let belowGroup = dataObj[belowGroupIndex];
		belowGroupArray = belowGroup.group;
		if(toggleCSS.hideNeighboursGroup) {
			forEach(belowGroupArray, function(value) {
				let indexes = value.split("/");
				let top = parseInt(indexes[0]);
				let left = parseInt(indexes[1]);
				let semiHideCellId = top + "_" + left;
				$("#block-" + semiHideCellId).addClass("semiHideCell");
			});
		}
		if(toggleCSS.highlightNeighboursGroup) {
			forEach(belowGroupArray, function(value) {
				let indexes = value.split("/");
				let top = parseInt(indexes[0]);
				let left = parseInt(indexes[1]);
				for(let i = 1; i < top; i++) {
					let highlightCellId = i + "_" + left;
					$("#block-" + highlightCellId).addClass("highlightGroupCell");
				}
			});
		}
	}

	let aboveGroupIndex = parseInt(nameIndex[1]);
	let aboveGroup = dataObj[aboveGroupIndex];
	let aboveGroupArray = null;
	if(!isEmpty(aboveGroup)) {
		aboveGroupArray = aboveGroup.group;
		if(toggleCSS.hideNeighboursGroup) {
			forEach(aboveGroupArray, function(value) {
				let indexes = value.split("/");
				let top = parseInt(indexes[0]);
				let left = parseInt(indexes[1]);
				let semiHideCellId = top + "_" + left;
				$("#block-" + semiHideCellId).addClass("semiHideCell");
			});
		}
		if(toggleCSS.highlightNeighboursGroup) {
			forEach(aboveGroupArray, function(value) {
				let indexes = value.split("/");
				let top = parseInt(indexes[0]);
				let left = parseInt(indexes[1]);
				for(let i = 20; i > top; i--) {
					let highlightCellId = i + "_" + left;
					$("#block-" + highlightCellId).addClass("highlightGroupCell");
				}
			});
		}
	}

	let neighbourCells = [
		{
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
		if(selectedCell.empty() || selectedCell.classed("disableCell")) {
			return false;
		}
		if(!isEmpty(aboveGroupArray) && indexOf(aboveGroupArray, cellValue) !== -1) {
			return true;
		}
		if(!isEmpty(belowGroupArray) && indexOf(belowGroupArray, cellValue) !== -1) {
			return true;
		}
		if(!isEmpty(selectedGroupArray) && indexOf(selectedGroupArray, cellValue) !== -1) {
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
		switch(neighbourCell.name) {
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
function addDetailsText(cellId, row, col) {
	d3.select('#lapGroupPath').selectAll('text').remove();
	d3.select('#lapGroupPath').selectAll('path').remove();
	d3.select('#analogText').selectAll('text').remove();
	let distance = row * col;
	let detail = {
		sf: "SF: " + distance,
		ft: "Feet: " + round(distance * 88, 2),
		yd: "Yard: " + round(distance * 29.3333, 2),
		meter: "Meter: " + round(distance * 26.8224, 2),
		// ft: "Feet: " + round(distance * 87, 2),
		// yd: "Yard: " + round(distance * 29, 2),
		// meter: "Meter: " + round(distance * 26.66, 2),
		fit: "Fit: " + cellId.replace("_", "/"),
		speed: "Speed: " + row,
		time: "Time: " + col
	}
	d3.select("#lapGroupPath").append("text")
		.attr("class", "textDetails")
		.attr("x", 0)
		.attr("y", 15)
		.text(detail.sf);
	d3.select("#lapGroupPath").append("text")
		.attr("class", "textDetails")
		.attr("x", 0)
		.attr("y", 35)
		.text(detail.ft);
	d3.select("#lapGroupPath").append("text")
		.attr("class", "textDetails")
		.attr("x", 0)
		.attr("y", 55)
		.text(detail.yd);
	d3.select("#lapGroupPath").append("text")
		.attr("class", "textDetails")
		.attr("x", 0)
		.attr("y", 75)
		.text(detail.meter);
	d3.select("#lapGroupPath").append("text")
		.attr("class", "textDetails")
		.attr("x", 400)
		.attr("y", 15)
		.text(detail.fit);
	d3.select("#lapGroupPath").append("text")
		.attr("class", "textDetails")
		.attr("x", 400)
		.attr("y", 35)
		.text(detail.speed);
	d3.select("#lapGroupPath").append("text")
		.attr("class", "textDetails")
		.attr("x", 400)
		.attr("y", 65)
		.text(detail.time);

	d3.select("#sampleLapGroupPath").append("text")
		.attr("class", "sampleTextDetails")
		.attr("x", 0)
		.attr("y", 20)
		.text(detail.sf);
	d3.select("#sampleLapGroupPath").append("text")
		.attr("class", "sampleTextDetails")
		.attr("x", 0)
		.attr("y", 50)
		.text(detail.ft);
	d3.select("#sampleLapGroupPath").append("text")
		.attr("class", "sampleTextDetails")
		.attr("x", 400)
		.attr("y", 20)
		.text(detail.fit);
	d3.select("#sampleLapGroupPath").append("text")
		.attr("class", "sampleTextDetails")
		.attr("x", 400)
		.attr("y", 50)
		.text(detail.speed);

	let dtextPos = 25;
	if(distance > 9 && distance < 100) {
		dtextPos = 20;
	} else if(distance > 99) {
		dtextPos = 15;
	}
	d3.select("#analogText").append("text")
		.attr("class", "analogTextDetail")
		.attr("x", dtextPos)
		.attr("y", 105)
		.text(distance + " Ellipsis");
	drawLaps(distance);
}
function drawLaps(num) {
	if(!num) {
		return;
	}
	let laps = parseInt(num / 15);
	let blocks = num % 15;
	if(laps) {
		d3.select("#lapGroupPath").append("text")
			.attr("class", "lapDetails")
			.attr("x", 190)
			.attr("y", 200)
			.text(laps + (laps == 1 ? " Lap" : " Laps"));
	}

	switch(blocks) {
		case 0: d3.select("#lapGroupPath").append("path")
				.style("stroke", "#ece27e")
				.attr("d", "M318 313 A 250 180, 1, 0 0, 385 289");
		case 14: d3.select("#lapGroupPath").append("path")
				.style("stroke", "#c0e0a7")
				.attr("d", "M248 320 A 250 180, 1, 0 0, 315 313.5");
		case 13: d3.select("#lapGroupPath").append("path")
				.style("stroke", "#56b894")
				.attr("d", "M172 311 A 250 180, 1, 0 0, 245 320.5");
		case 12: d3.select("#lapGroupPath").append("path")
				.style("stroke", "#3a816f")
				.attr("d", "M103 282 A 250 130, 1, 0 0, 170 310.5");
		case 11: d3.select("#lapGroupPath").append("path")
				.style("stroke", "#23544d")
				.attr("d", "M57 232 A 250 130, 1, 0 0, 100 280");
		case 10: d3.select("#lapGroupPath").append("path")
				.style("stroke", "#243a7a")
				.attr("d", "M60 162 A 250 130, 1, 0 0, 56 230");
		case 9: d3.select("#lapGroupPath").append("path")
				.style("stroke", "#2d6eb5")
				.attr("d", "M107 116 A 250 130, 1, 0 0, 61 160");
		case 8: d3.select("#lapGroupPath").append("path")
				.style("stroke", "#5fa4db")
				.attr("d", "M172 89 A 180 100, 1, 0 0, 110 114");
		case 7: d3.select("#lapGroupPath").append("path")
				.style("stroke", "#99c3e8")
				.attr("d", "M242 79.5 A 180 100, 1, 0 0, 175 88");
		case 6: d3.select("#lapGroupPath").append("path")
				.style("stroke", "#9d9acb")
				.attr("d", "M308 85 A 250 200, 1, 0 0, 245 79.5");
		case 5: d3.select("#lapGroupPath").append("path")
				.style("stroke", "#7070b5")
				.attr("d", "M373 105 A 340 60, 0, 0 0, 310 85");
		case 4: d3.select("#lapGroupPath").append("path")
				.style("stroke", "#66499c")
				.attr("d", "M422 138 A 360 120, 0, 0 0, 375 106");
		case 3: d3.select("#lapGroupPath").append("path")
				.style("stroke", "#6c2b85")
				.attr("d", "M450 188 A 320 150, 0, 0 0, 424 140");
		case 2: d3.select("#lapGroupPath").append("path")
				.style("stroke", "#4b295b")
				.attr("d", "M436 245 A 320 150, 0, 0 0, 450 190");
		case 1: d3.select("#lapGroupPath").append("path")
				.style("stroke", "#1f1b21")
				.attr("d", "M388 287 A 400 150, 0, 0 0, 434 248");
	}
}
function genrateTemplate() {
	let xpos = 35;
	let ypos = 1;
	let width = 80;
	let height = 80;
	for(let row = 20; row > 0; row--) {
		d3.select("#gridSVG").append("g").attr("id", "row_" + row);
		for(let col = 1; col < 11; col++) {
			let cellText = row + "/" + col;
			let cellId = row + "_" + col;
			let laps = parseInt((row * col) / 15);
			let sfText = (row * col) + "SF";
			let cell = findCellDetails(cellText);
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
					handleClickBlock(cell, cellId, row, col);
				});
			d3.select("#row_" + row).append("text")
				.attr("id", "text-" + cellId)
				.attr("class", "cellText")
				.attr("x", xpos + 12)
				.attr("y", ypos + 50)
				.text(cellText)
				.on("click", function() {
					handleClickBlock(cell, cellId, row, col);
				});
			d3.select("#row_" + row).append("text")
				.attr("id", "sf-" + cellId)
				.attr("class", "sfText")
				.attr("x", xpos + 2)
				.attr("y", ypos + 15)
				.text(sfText)
				.on("click", function() {
					handleClickBlock(cell, cellId, row, col);
				});
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
			.attr("y", ypos + 50)
			.text(paceSec ? paceSec : "00");

		xpos = 35;
		ypos += height;	
	}
	for(let col = 1; col < 11; col++) {
		d3.select("#repetitionLabelWrap").append("text")
			.attr("class", "svgHeaderLabel")
			.attr("x", (col * 80) - 40)
			.attr("y", 55)
			.text(11-col);
		d3.select("#runTimeLabelWrap").append("text")
			.attr("class", "svgFooterLabel")
			.attr("x", (col * 80) - 40)
			.attr("y", 20)
			.text(col);
	}

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
}

function updateAnalog(row, col) {
	let pace = calcPaceValue(row);
	let { paceValue } = pace;
	let paceAngle = paceValue * 6;
	let colAngle = col * 6;
	let speedAngle = 240 + (row * 12);
	if(speedAngle > 360) {
		speedAngle -= 360;
	}

	if(paceValue == 60) {
		d3.select("#face").attr("fill", "#ea2525");
	} else {
		d3.select("#face").attr("fill", "none");
		let paceArc = describeArc(50, 50, 45, 0, paceAngle);
		d3.select("#paceArc").attr("d", paceArc);
	}
	let colArc = describeArc(50, 50, 45, 0, colAngle);
	d3.select("#colArc").attr("d", colArc);

	if(toggleCSS.speedometer) {
		let speedArc = describeSpeedArc(50, 50, 28, 240, speedAngle);
		d3.select("#speedArc").attr("d", speedArc);
	}
	
	d3.select('#paceTimeText').selectAll('text').remove();
	if(toggleCSS.hideBlockNameClock) {
		let xPaceTime = 38;
		if(row > 9 && col > 9) {
			xPaceTime = 28;
		} else if(row > 9 || col > 9) {
			xPaceTime = 33;
		}
		d3.select("#paceTimeText").append("text")
			.attr("class", "clockSFValueText")
			.attr("x", xPaceTime)
			.attr("y", 58)
			.text(row + "/" + col);
		d3.select("#paceTimeText").append("text")
			.attr("class", "paceValueText")
			.attr("x", 35)
			.attr("y", 64)
			.text("SPEED /");
		d3.select("#paceTimeText").append("text")
			.attr("class", "timeValueText")
			.attr("x", 52)
			.attr("y", 64)
			.text("TIME");
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
function initAnalog(row, col) {
	d3.select("#face").attr("fill", "#ea2525");
	d3.select("#paceArc").attr("d", "");
	d3.select("#colArc").attr("d", "");
	d3.select("#speedArc").attr("d", "");
	d3.select('#analogText').selectAll('text').remove();
	d3.select('#paceTimeText').selectAll('text').remove();
	if(toggleCSS.hideBlockNameClock) {
		d3.select("#paceTimeText").append("text")
			.attr("class", "clockSFValueText")
			.attr("x", 38)
			.attr("y", 58)
			.text("0/0");
		d3.select("#paceTimeText").append("text")
			.attr("class", "paceValueText")
			.attr("x", 35)
			.attr("y", 64)
			.text("SPEED /");
		d3.select("#paceTimeText").append("text")
			.attr("class", "timeValueText")
			.attr("x", 52)
			.attr("y", 64)
			.text("TIME");
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
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}
function describeArc(x, y, radius, startAngle, endAngle){
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
function describeSpeedArc(x, y, radius, startAngle, endAngle){
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);
    if(endAngle > 60 && endAngle < 180) {
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
	switch(menuOptions) {
		case 'adjustWidth': 
			if(isSidebarOpen) {
			  	document.getElementById("mySidenav").style.width = "0";
			  	document.getElementById("main").style.width= "100%";
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
			if(isSidebarOpen) {
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
			if(isSidebarOpen) {
			  	document.getElementById("mySidenav").style.width = "0";
			  	document.getElementById("main").style.marginLeft= "0";
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
	reset();
}
function handleMenuOptions() {
	toggleSidebar();
	toggleCSS.menuOptions = $("#selectMenu").val();
}
function handleArrowOptions() {
	toggleCSS.arrowOptions = $("#selectArrow").val();
	reset();
}
function handleSpeedmeterToggle() {
	let { speedometer } = toggleCSS;
	toggleCSS.speedometer = !speedometer;
	if(toggleCSS.speedometer) {
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
	drawSampleLaps(row*col);
	updateSampleAnalog(row, col);
	d3.select("#sampleBlocks").selectAll("rect").remove();
	d3.select("#sampleBlocks").selectAll("text").remove();
	let neighbourCells = [
		{
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
		if(!row || !col || row > 20 || col > 10) {
			isValid = false;
		}
		if(isValid) {
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
					handleClickBlock(cellObj, cellId, row, col);
				});
			d3.select("#sampleBlocks").append("text")
				.attr("id", "sampletext-" + cellId)
				.attr("class", "cellText")
				.attr("x", xpos + 12)
				.attr("y", ypos + 50)
				.text(value)
				.on("click", function() {
					handleClickBlock(cellObj, cellId, row, col);
				});
			d3.select("#sampleBlocks").append("text")
				.attr("id", "samplesf-" + cellId)
				.attr("class", "sfText")
				.attr("x", xpos + 2)
				.attr("y", ypos + 15)
				.text(sfText)
				.on("click", function() {
					handleClickBlock(cellObj, cellId, row, col);
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
			if(!col && row && row < 21) {
				lable = row;
			} else if(!row && col && col < 11) {
				lable = col;
			} else if(row > 20 && col && col < 11) {
				lable = 11 - col;
			} else if(col > 10 && row && row < 21) {
				let pace = calcPaceValue(row);
				let { paceMin, paceSec } = pace;
				lable = paceMin;
				isPace = true;
			d3.select("#sampleBlocks").append("text")
				.attr("id", "sampletextMini-" + cellId)
				.attr("class", "sampletextMini")
				.attr("x", xpos + (paceMin > 9 ? 40 : 25))
				.attr("y", ypos + 50)
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
		if(xpos > 240) {
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
		switch(neighbourCell.name) {
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
						handleClickBlock(cellObj, cellId, row, col);
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
						handleClickBlock(cellObj, cellId, row, col);
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
						handleClickBlock(cellObj, cellId, row, col);
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
						handleClickBlock(cellObj, cellId, row, col);
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
						handleClickBlock(cellObj, cellId, row, col);
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
						handleClickBlock(cellObj, cellId, row, col);
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
						handleClickBlock(cellObj, cellId, row, col);
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
						handleClickBlock(cellObj, cellId, row, col);
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
	switch(arrowOptions) {
		case 'blinkTogether':
			let display = 0;
			blinkTimer = setInterval(function() {
				if(display) {
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
				if(arrowArray.length <= count) {
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
				if(arrowArray.length < count2) {
					count2 = 0;
					$(".arrowPathClass").addClass("displayNone");
					$(".nclbText").addClass("displayNone");
				}
			}, 700);
			break;
	}
}

function drawSampleLaps(num) {
	d3.select('#sampleLapGroupPath').selectAll('text').remove();
	d3.select('#sampleLapGroupPath').selectAll('path').remove();
	if(!num) {
		return;
	}
	let laps = parseInt(num / 15);
	let blocks = num % 15;
	if(laps) {
		d3.select("#sampleLapGroupPath").append("text")
			.attr("class", "sampleLapDetails")
			.attr("x", 190)
			.attr("y", 200)
			.text(laps + (laps == 1 ? " Lap" : " Laps"));
	}

	switch(blocks) {
		case 0: d3.select("#sampleLapGroupPath").append("path")
				.style("stroke", "#ece27e")
				.style("stroke-width", "15px")
				.attr("d", "M318 313 A 250 180, 1, 0 0, 385 289");
		case 14: d3.select("#sampleLapGroupPath").append("path")
				.style("stroke", "#c0e0a7")
				.style("stroke-width", "15px")
				.attr("d", "M248 320 A 250 180, 1, 0 0, 315 313.5");
		case 13: d3.select("#sampleLapGroupPath").append("path")
				.style("stroke", "#56b894")
				.style("stroke-width", "15px")
				.attr("d", "M172 311 A 250 180, 1, 0 0, 245 320.5");
		case 12: d3.select("#sampleLapGroupPath").append("path")
				.style("stroke", "#3a816f")
				.style("stroke-width", "15px")
				.attr("d", "M103 282 A 250 130, 1, 0 0, 170 310.5");
		case 11: d3.select("#sampleLapGroupPath").append("path")
				.style("stroke", "#23544d")
				.style("stroke-width", "15px")
				.attr("d", "M57 232 A 250 130, 1, 0 0, 100 280");
		case 10: d3.select("#sampleLapGroupPath").append("path")
				.style("stroke", "#243a7a")
				.style("stroke-width", "15px")
				.attr("d", "M60 162 A 250 130, 1, 0 0, 56 230");
		case 9: d3.select("#sampleLapGroupPath").append("path")
				.style("stroke", "#2d6eb5")
				.style("stroke-width", "15px")
				.attr("d", "M107 116 A 250 130, 1, 0 0, 61 160");
		case 8: d3.select("#sampleLapGroupPath").append("path")
				.style("stroke", "#5fa4db")
				.style("stroke-width", "15px")
				.attr("d", "M172 89 A 180 100, 1, 0 0, 110 114");
		case 7: d3.select("#sampleLapGroupPath").append("path")
				.style("stroke", "#99c3e8")
				.style("stroke-width", "15px")
				.attr("d", "M242 79.5 A 180 100, 1, 0 0, 175 88");
		case 6: d3.select("#sampleLapGroupPath").append("path")
				.style("stroke", "#9d9acb")
				.style("stroke-width", "15px")
				.attr("d", "M308 85 A 250 200, 1, 0 0, 245 79.5");
		case 5: d3.select("#sampleLapGroupPath").append("path")
				.style("stroke", "#7070b5")
				.style("stroke-width", "15px")
				.attr("d", "M373 105 A 340 60, 0, 0 0, 310 85");
		case 4: d3.select("#sampleLapGroupPath").append("path")
				.style("stroke", "#66499c")
				.style("stroke-width", "15px")
				.attr("d", "M422 138 A 360 120, 0, 0 0, 375 106");
		case 3: d3.select("#sampleLapGroupPath").append("path")
				.style("stroke", "#6c2b85")
				.style("stroke-width", "15px")
				.attr("d", "M450 188 A 320 150, 0, 0 0, 424 140");
		case 2: d3.select("#sampleLapGroupPath").append("path")
				.style("stroke", "#4b295b")
				.style("stroke-width", "15px")
				.attr("d", "M436 245 A 320 150, 0, 0 0, 450 190");
		case 1: d3.select("#sampleLapGroupPath").append("path")
				.style("stroke", "#1f1b21")
				.style("stroke-width", "15px")
				.attr("d", "M388 287 A 400 150, 0, 0 0, 434 248");
	}
}

function updateSampleAnalog(row, col) {
	let pace = calcPaceValue(row);
	let { paceValue } = pace;
	let paceAngle = paceValue * 6;
	let colAngle = col * 6;
	let speedAngle = 240 + (row * 12);
	if(speedAngle > 360) {
		speedAngle -= 360;
	}

	if(paceValue == 60) {
		d3.select("#sampleface").attr("fill", "#ea2525");
	} else {
		d3.select("#sampleface").attr("fill", "none");
		let paceArc = describeArc(50, 50, 45, 0, paceAngle);
		d3.select("#samplepaceArc").attr("d", paceArc);
	}
	let colArc = describeArc(50, 50, 45, 0, colAngle);
	d3.select("#samplecolArc").attr("d", colArc);

	if(toggleCSS.speedometer) {
		let speedArc = describeSpeedArc(50, 50, 28, 240, speedAngle);
		d3.select("#samplespeedArc").attr("d", speedArc);
	}
	
	d3.select('#samplepaceTimeText').selectAll('text').remove();
	if(toggleCSS.hideBlockNameClock) {
		let xPaceTime = 38;
		if(row > 9 && col > 9) {
			xPaceTime = 28;
		} else if(row > 9 || col > 9) {
			xPaceTime = 33;
		}
		d3.select("#samplepaceTimeText").append("text")
			.attr("class", "sampleclockSFValueText")
			.attr("x", xPaceTime)
			.attr("y", 58)
			.text(row + "/" + col);
		d3.select("#samplepaceTimeText").append("text")
			.attr("class", "paceValueText")
			.attr("x", 35)
			.attr("y", 64)
			.text("SPEED /");
		d3.select("#samplepaceTimeText").append("text")
			.attr("class", "timeValueText")
			.attr("x", 52)
			.attr("y", 64)
			.text("TIME");
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
	if(toggleCSS.hideBlockNameClock) {
		d3.select("#samplepaceTimeText").append("text")
			.attr("class", "clockSFValueText")
			.attr("x", 38)
			.attr("y", 58)
			.text("0/0");
		d3.select("#samplepaceTimeText").append("text")
			.attr("class", "paceValueText")
			.attr("x", 35)
			.attr("y", 64)
			.text("SPEED /");
		d3.select("#samplepaceTimeText").append("text")
			.attr("class", "timeValueText")
			.attr("x", 52)
			.attr("y", 64)
			.text("TIME");
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

let startX = 0, startY = 0
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
	  	if(dy < 20) {
	  		if(dx > 50) {
	  			rightSwipe();
	  		} else if(dx < -50) {
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
	if(sampleView < 3) {
		++sampleView;
		displayView();
	}
}

function rightSwipe() {
	if(sampleView > 1) {
		--sampleView;
		displayView();
	}
}

function displayView() {
	switch(sampleView) {
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