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
var movementEase = 0.1;

//points
var pointCount = 30;
var pointGap = 120 / pointCount;
var pointSize = 0.1;
var points = [];

//heights
var heightMul = 50;
var heightLower = 45;
var heightLayers = 10;
var originSize = 5;
var waterHeight = 35;
var currentWaterHeight;

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
var cloudMovementX;
var cloudMovementY;
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
var cityNightBrightness = 1.4;
var colorEase = 0.05;

//biome
var forest;
var desert;
var ocean;
var alien;
var biomeRes;
var biomeBlend = 0.1;

//grids
var grid = new Grid();
var gridHeight = 40;
var gridLine = 0.01;

//stories
var stories = [];
var storyHeight = 9;
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

function initializeBiomes() {
	//x, y, res, peak, valley, city, water, water height, height, citychance
	forest = new Biome(800, 800, res, createVector(0, 255, 0), createVector(50, 50, 0), createVector(50, 50, 0), createVector(0, 180, 210), 25, 50, 0.25);
	desert = new Biome(120, 120, res, createVector(255, 225, 100), createVector(255, 190, 85), createVector(255, 165, 75), createVector(0, 0, 0), 0, 20, 0.1);
	ocean = new Biome(920, 920, res, createVector(0, 0, 0), createVector(0, 0, 0), createVector(0, 0, 0), createVector(90, 165, 230), 30, 0, 0);
	alien = new Biome(740, 740, res, createVector(255, 100, 100), createVector(120, 210, 175), createVector(30, 170, 140), createVector(120, 210, 175), 20, 50, 0.05);
}

function initializeColors() {
	gridColor = createVector(60, 60, 60);
	storyTextColor = createVector(255, 255, 255);
	storyPinColor = createVector(255, 255, 255);

	valleyColor = alien.valleyColor;
	peakColor = alien.peakColor;
	cityColor = alien.cityColor;
	waterColor = alien.waterColor;
	cloudColor = createVector(255, 255, 255);

	currentValley = valleyColor;
	currentPeak = peakColor;
	currentCity = cityColor;
	currentWater = waterColor;
	currentCloud = cloudColor;
}

function initializeCloudNoise() {
	noiseSeed(500);

	cloudXoff = random(50, 500);
	cloudYoff = random(50, 500);
	cloudMovementX = random(50, 500);
	cloudMovementY = random(50, 500);
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