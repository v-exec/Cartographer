//biomes - lerp between multiple noise sets - whoever is highest is drawn, blend where values are especially close

//sketch size
var size = 600;

//noise
var xOff = 0;
var yOff = 0;
var res = 0.1;

//movement speed
var speed = 0.15;
var currentX = 0;
var currentY = 0;
var ease = 0.1;

//points
var pointCount = 30;
var pointGap = 120 / pointCount;
var pointSize = 0.1;
var points = [];

//heights
var heightMul = 50;
var heightLayers = 10;
var originSize = 5;
var waterHeight = 35;

//cities
var cityXoff = 1000;
var cityYoff = 5000;
var cityThreshold = 0.25;
var cityMul = 0.9;
var cityGap = 7;
var floorHeight = 4;
var floors = 1;

//clouds
var cloudXoff;
var cloudYoff;
var cloudSpeedMax = 0.04;
var cloudMovement;
var windChaos = 0.001;
var cloudHeight = 30;
var cloudThreshold;
var cloudiness = 600;
var cloudinessInc = 0.001;
var maxCloudiness = 0.5;

//time
var clock = 0;
var clockSpeed = 0.01;

//colors
var valleyColor;
var peakColor;
var cityColor;
var waterColor;
var cloudColor;
var gridColor;
var storyTextColor;
var storyPinColor;

var currentValley;
var currentPeak;
var currentCity;
var currentWater;
var currentCloud;

var nightDarkness = 2;

//biome
var forest;
var desert;
var ocean;
var alien;
var biomeRes = 0.1;
var biomeBlend = 0.1;

//grids
var grid = new Grid();
var gridHeight = 40;
var gridLine = 0.01;

//stories
var stories = [];
var storyHeight = -(heightMul / 6);
var storyScale = 3;
var fontScale = 5;
var storyFont;
var storyJSON;
var storyData = [];

//input
var inputBox;
var pinDistance = 1;
var pinOriginDistance = 5;

//camera
var camRotationUp = -35;
var camRotationLeft = 45;
var camHeight = -30;
var camZoom = 300;

function preload() {
	storyFont = loadFont('assets/Comfortaa-Bold.otf');
	storyJSON = loadJSON('assets/stories.json');
	storyData = storyJSON['stories'];
	inputBox = document.getElementById('inputBox');
}

function setup() {
	var canvas = createCanvas(size, size, WEBGL);
	canvas.parent(document.getElementById('canvasParent'));

	initializeBiomes();
	initializeColors();
	initializeCloudNoise();
	generatePoints();
	generateStories();
}

function draw() {
	background(34);

	setupCamera();

	manageClouds();
	passTime();

	moveMap();
	updatePoints();

	grid.show();
	drawPoints();

	for (var i = 0; i < stories.length; i++) {
		stories[i].show();
	}
}

function initializeBiomes() {
	forest = new Biome(800, 800, biomeRes, createVector(0, 255, 0), createVector(50, 50, 0), createVector(50, 50, 0), createVector(0, 180, 210), 25, 50, 0.25);
	desert = new Biome(120, 120, biomeRes, createVector(255, 225, 100), createVector(255, 190, 85), createVector(255, 165, 75), createVector(0, 0, 0), 0, 20, 0.1);
	ocean = new Biome(920, 920, biomeRes, createVector(0, 0, 0), createVector(0, 0, 0), createVector(0, 0, 0), createVector(90, 165, 230), 30, 0, 0);
	alien = new Biome(740, 740, biomeRes, createVector(255, 100, 100), createVector(120, 210, 175), createVector(60, 200, 210), createVector(120, 210, 175), 20, 50, 0.05);
}

function initializeColors() {
	gridColor = createVector(60, 60, 60);
	storyTextColor = createVector(255, 255, 255);
	storyPinColor = createVector(255, 255, 255);
	currentCloud = createVector(255, 255, 255);

	valleyColor = alien.valleyColor;
	peakColor = alien.peakColor;
	cityColor = alien.cityColor;
	waterColor = alien.waterColor;
	cloudColor = createVector(255, 255, 255);

	currentValley = alien.valleyColor;
	currentPeak = alien.peakColor;
	currentCity = alien.cityColor;
	currentWater = alien.waterColor;
}

function initializeCloudNoise() {
	noiseSeed(500);

	cloudXoff = random(50, 500);
	cloudYoff = random(50, 500);
	cloudMovement = random(50, 500);
}

function generatePoints() {
	for (var i = 0; i < pointCount; i++) {
		for (var j = 0; j < pointCount; j++) {
			append(points, new Point(i * pointGap, 0, j * pointGap, pointSize));
		}
	}
}

function generateStories() {
	storyData = storyJSON['stories'];
	for (var i = 0; i < storyData.length; i++) {
		var currentStory = storyData[i];
		append(stories, new Story(currentStory['x'], currentStory['y'], currentStory['text'], currentStory['time']));
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
	var cityX = cityXoff;
	var cloudX = cloudXoff;
	var forestX = forest.x;
	var desertX = desert.x;
	var oceanX = ocean.x;
	var alienX = alien.x;

	for (var i = 0; i < pointCount; i++) {
		x += res;
		cityX += res;
		cloudX += res;
		forestX += forest.res;
		desertX += desert.res;
		oceanX += ocean.res;
		alienX += alien.res;

		var y = yOff;
		var cityY = cityYoff;
		var cloudY = cloudYoff;
		var forestY = forest.y;
		var desertY = desert.y;
		var oceanY = ocean.y;
		var alienY = alien.y;

		for (var j = 0; j < pointCount; j++) {
			y += res;
			cityY += res;
			cloudY += res;
			forestY += forest.res;
			desertY += desert.res;
			oceanY += ocean.res;
			alienY += alien.res;

			//make terrain
			var index = i + (j * pointCount);
			var terrainNoise = noise(x, y) * heightMul;

			//add cities
			var newNoise = terrainNoise;
			var citySuccess = false;
			if (noise(cityX, cityY) < cityThreshold) {
				for (var k = 0; k < heightLayers; k++) {
					if (terrainNoise > cityGap * k) newNoise = (cityGap * cityMul) * k;
				}
				citySuccess = true;
			}
			if (citySuccess) terrainNoise = newNoise;

			//add clouds
			if (noise(cloudX, cloudY) < cloudThreshold) {
				terrainNoise = -cloudHeight;
				citySuccess = false;
			}

			//make origin
			var mDistance = dist(0, 0, xOff, yOff);
			if (mDistance < originSize) {
				points[index].update(lerp(terrainNoise, gridHeight, map(mDistance, 0, originSize, 1, 0)), false);
			} else {
				if (citySuccess) points[index].update(terrainNoise, true);
				else points[index].update(terrainNoise, false);
			}
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
	cityXoff += movement.x;
	cityYoff += movement.y;
	cloudXoff += movement.x;
	cloudYoff += movement.y;

	forest.x += movement.x;
	forest.y += movement.y;
	ocean.x += movement.x;
	ocean.y += movement.y;
	desert.x += movement.x;
	desert.y += movement.y;
	alien.x += movement.x;
	alien.y += movement.y;

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
			if (dist(stories[i].pos.x, stories[i].pos.y, xOff, yOff) < pinDistance) near = true;
		}

		//create new pin - server save
		if (dist(xOff, yOff, 0, 0) > pinOriginDistance) {
			if (!near) {
			var h = hour();
			if (h == 12) h = h + ':' + minute() + 'pm';
			else if (h > 12) h = (h - 12) + ':' + minute() + 'pm';
			else h = h + ':' + minute() + 'am';
			var time = day() + '/' + month() + '/' + year() + ' - ' + h;
			
			var newJSON = {};
			newJSON.x = xOff;
			newJSON.y = yOff;
			newJSON.text = input;
			newJSON.time = time;

			append(storyJSON['stories'], newJSON);
			issueRequest(JSON.stringify(storyJSON));
			} else {
				inputBox.placeholder = 'pin too close to nearby pins';
				setTimeout(function() {
					inputBox.placeholder = 'pin';
				}, 3000);
			}
		} else {
			inputBox.placeholder = 'pin too close to origin';
				setTimeout(function() {
				inputBox.placeholder = 'pin';
			}, 3000);
		}
	}
}

function manageClouds() {
	cloudiness += cloudinessInc;
	cloudThreshold = map(noise(cloudiness), 0, 1, 0, maxCloudiness);
	cloudMovement += windChaos;
	cloudXoff += map(noise(cloudMovement), 0, 1, -cloudSpeedMax, cloudSpeedMax);
	cloudYoff += map(noise(cloudMovement), 0, 1, -cloudSpeedMax, cloudSpeedMax);
}

function passTime() {
	clock += clockSpeed;
	if (clock > 12) clock = -12;

	//sunset
	if (clock > 6 && clock < 8) {
		var sunset = map(clock, 6, 8, 0, 1);
		currentValley = p5.Vector.lerp(valleyColor, p5.Vector.div(valleyColor, nightDarkness), sunset);
		currentPeak = p5.Vector.lerp(peakColor, p5.Vector.div(peakColor, nightDarkness), sunset);
		currentWater = p5.Vector.lerp(waterColor, p5.Vector.div(waterColor, nightDarkness), sunset);
		currentCity = p5.Vector.lerp(p5.Vector.div(cityColor, nightDarkness), cityColor, sunset);
		currentCloud = p5.Vector.lerp(cloudColor, p5.Vector.div(cloudColor, nightDarkness), sunset);
	}

	//sunrise
	if (clock < -6 && clock > -8) {
		var sunrise = map(clock, -8, -6, 0, 1);
		currentValley = p5.Vector.lerp(p5.Vector.div(valleyColor, nightDarkness), valleyColor, sunrise);
		currentPeak = p5.Vector.lerp(p5.Vector.div(peakColor, nightDarkness), peakColor, sunrise);
		currentWater = p5.Vector.lerp(p5.Vector.div(waterColor, nightDarkness), waterColor, sunrise);
		currentCity = p5.Vector.lerp(cityColor, p5.Vector.div(cityColor, nightDarkness), sunrise);
		currentCloud = p5.Vector.lerp(p5.Vector.div(cloudColor, nightDarkness), cloudColor, sunrise);
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
	if (updateStories()) {
		storyJSON = loadJSON('assets/stories.json', updateStories());
	}
}, 1000);