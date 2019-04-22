//sketch size
var size = 600;

//noise
var xOff = 0;
var yOff = 0;
var res = 0.1;

//movement speed
var speed = 0.2;
var currentX = 0;
var currentY = 0;
var ease = 0.1;

//points
var pointCount = 30;
var pointGap = 4;
var pointSize = 0.1;
var points = [];

//heights
var heightMul = 50;
var heightGap = 10;
var makeGaps = true;
var drawLowSpheres = false;

//colors
var valley;
var peak;
var gridColor;
var storyTextColor;

//grids
var grid = new Grid();
var gridHeight = 40;
var gridLine = 0.01;

//stories
var stories = [];
var storyHeight = - (heightMul / 5);
var storyScale = 3;
var fontScale = 5;
var storyFont;
var storyJSON;
var storyData = [];

//input
var inputBox;

//camera
var camRotationUp = -35;
var camRotationLeft = 45;
var camHeight = -30;
var camZoom = 300;

function preload() {
	storyFont = loadFont('assets/Comfortaa-Bold.otf');
	storyJSON = loadJSON('assets/stories.json');
	inputBox = document.getElementById('inputBox');
}

function setup() {
	createCanvas(size, size, WEBGL);

	//colors
	valley = createVector(120, 210, 175);
	peak = createVector(255, 100, 100);
	gridColor = createVector(60, 60, 60);
	storyTextColor = createVector(255, 255, 255);

	//generate points
	for (var i = 0; i < pointCount; i++) {
		for (var j = 0; j < pointCount; j++) {
			append(points, new Point(i * pointGap, 0, j * pointGap, pointSize));
		}
	}

	//generate stories
	storyData = storyJSON['stories'];
	for (var i = 0; i < storyData.length; i++) {
		var currentStory = storyData[i];
		append(stories, new Story(currentStory['x'], currentStory['y'], currentStory['text'], currentStory['time']));
	}
}

function draw() {
	background(34);

	setupCamera();
	//orbitControl();

	moveMap();
	updatePoints();

	grid.show();
	drawPoints();

	for (var i = 0; i < stories.length; i++) {
		stories[i].show();
	}
}

//camera angle
function setupCamera() {
	translate(0, camHeight, camZoom);

	//top-down angle
	rotate(radians(camRotationUp), createVector(1, 0, 0));

	//left-right angle
	rotate(radians(camRotationLeft), createVector(0, 1, 0));
}

function updatePoints() {
	var x = xOff;
	for (var i = 0; i < pointCount; i++) {
		x += res;
		var y = yOff;
		for (var j = 0; j < pointCount; j++) {
			y += res;
			var index = i + (j * pointCount);
			var noiseY = noise(x, y);
			points[index].update(noiseY * heightMul);
		}
	}
}

function drawPoints() {
	for (var i = 0; i < points.length; i++) {
		points[i].show();
	}
}

function moveMap() {
	var xMovement = false;
	var yMovement = false;

	if (keyIsDown(LEFT_ARROW)) {
		currentX = easeValue(currentX, -speed);
		xMovement = true;
	}
	
	if (keyIsDown(RIGHT_ARROW)) {
		currentX = easeValue(currentX, speed);
		xMovement = true;
	}
	
	if (keyIsDown(DOWN_ARROW)) {
		currentY = easeValue(currentY, -speed);
		yMovement = true;
	}
	
	if (keyIsDown(UP_ARROW)) {
		currentY = easeValue(currentY, speed);
		yMovement = true;
	}

	if (!xMovement) currentX = easeValue(currentX, 0);
	if (!yMovement) currentY = easeValue(currentY, 0);

	var movement = createVector(currentX, currentY);
	movement.limit(speed);

	xOff += movement.x;
	yOff += movement.y;

	select('#easttext').html(nf(xOff / 10, 0, 1));
	select('#northtext').html(nf(yOff / 10, 0, 1));
}

function handleInput(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		var input = inputBox.value;
		inputBox.value = null;

		//check for nearby pins
		var near = false;
		for (var i = 0; i < stories.length; i++) {
			if (abs(xOff - stories[i].pos.x) < 0.8 && abs(yOff - stories[i].pos.y) < 0.8) near = true;
		}

		if (!near) {
			//create new pin - local
			var h = hour();
			if (h == 12) h = h + ':' + minute() + 'pm';
			else if (h > 12) h = (h - 12) + ':' + minute() + 'pm';
			else h = h + ':' + minute() + 'am';

			var time = day() + '/' + month() + '/' + year() + ' - ' + h;
			append(stories, new Story(xOff, yOff, input, time));

			//create new pin - server save
			var newJSON = {};
			newJSON.x = xOff;
			newJSON.y = yOff;
			newJSON.text = input;
			newJSON.time = time;

			append(storyJSON['stories'], newJSON);

			issueRequest(JSON.stringify(storyJSON));
		} else {
			inputBox.value = 'pin too close to nearby pins';
		}
	}
}

function updateStories() {
	if (storyData) {
		stories = [];
		storyData = storyJSON['stories'];

		for (var i = 0; i < storyData.length; i++) {
			var currentStory = storyData[i];
			append(stories, new Story(currentStory['x'], currentStory['y'], currentStory['text'], currentStory['time']));
		}
	} else console.log('Had trouble loading stories during this ping.');
}

function easeValue(val, target) {
	val += ((target - val) * ease);
	return val;
}

var apiPath = 'http://exp.v-os.ca/Cartographer/scripts/writer.php';

function issueRequest(sText) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', apiPath + '?request=write&text=' + sText);
	xhr.onload = function() {
		if (xhr.status === 200) {
			//handle response
			console.log(xhr.responseText);
		}
		else {
			//handle error
			console.log('Did not recieve reply.');
		}
	};
	xhr.send();
}

//update the stories every second
setInterval(function() {
	storyJSON = loadJSON('assets/stories.json', updateStories());
}, 1000);