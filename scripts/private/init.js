//arguments
p5.disableFriendlyErrors = true;

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
var pointSize = 0.6;
var sphereDetail = 6;
var points = [];

//heights
var heightLower = 45;
var heightLayers = 10;
var originSize = 5;
var currentWaterHeight;

//cities
var cityXoff = 1000;
var cityYoff = 5000;
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

//time
var clock = 0;
var clockSpeed = 0.01;

//colors
var cloudColor;
var gridColor;
var storyTextColor;
var storyPinColor;

var nightDarkness = 1.4;
var cityNightBrightness = 1.4;

//biome
var forest;
var desert;
var ocean;
var alien;
var biomeSize = 50;
var oceanHeight = 35;
var biomeBlendThreshold = 0.04;

//grids
var grid = new Grid();
var gridHeight = 40;
var gridLine = 0.7;

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
	//x, y, peak, valley, city, water, water height, height, citychance, cloudchance
	forest = new Biome(800, 800, createVector(110, 200, 110), createVector(90, 90, 10), createVector(100, 100, 0), createVector(0, 180, 210), oceanHeight, 50, 0.25, 0.4);
	desert = new Biome(120, 120,createVector(255, 225, 100), createVector(165, 120, 60), createVector(255, 165, 75), createVector(90, 165, 230), oceanHeight + 8, 25, 0.15, 0.15);
	ocean = new Biome(920, 920, createVector(255, 225, 100), createVector(255, 225, 100), createVector(0, 0, 0), createVector(90, 165, 230), oceanHeight, 12, 0, 0.5);
	alien = new Biome(740, 740, createVector(255, 100, 100), createVector(120, 210, 175), createVector(30, 170, 180), createVector(120, 210, 175), oceanHeight, 50, 0.2, 0.4);
}

function initializeColors() {
	gridColor = createVector(60, 60, 60);
	storyTextColor = createVector(255, 255, 255);
	storyPinColor = createVector(255, 255, 255);
	cloudColor = createVector(255, 255, 255);
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