//p5
const s = ( sketch ) => {};
var p = new p5(s);

p5.disableFriendlyErrors = true;

var loader = new THREE.FontLoader();
var customFont;
loader.load('assets/Comfortaa_Bold.json', function (font) {
	customFont = font;
	updateStories();
});

var storyData;
var inputBox = document.getElementById('inputBox');

//rendering
var size = 600;

//touch support
var currentTouch;
var previousTouch;

//noise
var xOff = 0;
var yOff = 0;
var res = 0.1;

//movement speed
var speed = 0.15;
var touchDampen = 0.015;
var currentX = 0;
var currentY = 0;
var movementEase = 0.1;

//points
var pointCount = 30;
var pointGap = pointCount / 7;
var pointSize = 0.8;
var dotDetail = 4;
var points = [];

//heights
var heightLayers = 10;
var originSize = 5;
var currentWaterHeight;

//cities
var cityXoff = 1000;
var cityYoff = 5000;
var cityMul = 0.9;
var cityGap = 7;
var floorHeight = 10;
var floors = 2;

//clouds
var cloudXoff;
var cloudYoff;
var cloudSpeedMax = 0.04;
var cloudMovementX;
var cloudMovementY;
var windChaos = 0.001;
var cloudHeight = 100;
var cloudThreshold;
var cloudiness = 600;
var cloudinessInc = 0.001;

//time
var clock = -9;
var clockSpeed = 0.015;

//colors
var cloudColor;
var gridColor;
var storyTextColor;
var storyPinColor;

var nightDarkness = 1.7;
var cityNightBrightness = 1.7;

//biome
var forest;
var desert;
var ocean;
var alien;
var biomeSize = 50;
var oceanHeight = -5;
var biomeBlendThreshold = 0.04;

//grids
var grid;
var gridHeight = 0;
var gridLine = 0.7;

//stories
var stories = [];
var storyHeight = 70;
var storyScale = 3;
var fontScale = 3.8;
var textDistance = 25;
var timeDistance = 15;
var storyMapSize = 2;
var storyParallax = 25;
var storyData = [];
var storyReady = true;
var liveUpdate;
var updateInterval = 12000;
var postIntervalLimit = 10000;

//input
var inputBox;
var pinDistance = 1;
var pinOriginDistance = 5;

//camera
var camHeight = 150;
var camZoom = 120;
var cameraAngle = 30;

//three
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
renderer.setSize(size, size);
document.getElementById('canvasParent').appendChild(renderer.domElement);

function initializeBiomes() {
	//x, y, peak, valley, city, water, water height, height, citychance, cloudchance
	forest = new Biome(800, 800, p.createVector(0.45, 0.85, 0.45), p.createVector(0.4, 0.4, 0.05), p.createVector(0.45, 0.45, 0), p.createVector(0, 0.6, 0.9), oceanHeight, 40, 0.25, 0.4);
	desert = new Biome(120, 120, p.createVector(1, 0.9, 0.45), p.createVector(0.7, 0.5, 0.2), p.createVector(1, 0.6, 0.3), p.createVector(0.4, 0.6, 0.9), oceanHeight + 3, 25, 0.15, 0.15);
	ocean = new Biome(920, 920, p.createVector(1, 1, 0.45), p.createVector(1, 0.8, 0.45), p.createVector(0, 0, 0), p.createVector(0.4, 0.6, 0.9), oceanHeight, 2, 0, 0.5);
	alien = new Biome(740, 740, p.createVector(1, 0.45, 0.45), p.createVector(0.5, 0.9, 0.8), p.createVector(0.1, 0.6, 0.7), p.createVector(0.5, 0.9, 0.8), oceanHeight, 40, 0.2, 0.4);
}

function initializeColors() {
	gridColor = p.createVector(0.2, 0.2, 0.2);
	storyTextColor = p.createVector(1, 1, 1);
	storyPinColor = p.createVector(1, 1, 1);
	cloudColor = p.createVector(1, 1, 1);
	currentCloud = cloudColor;
}

function initializeCloudNoise() {
	p.noiseSeed(500);

	cloudXoff = p.random(50, 500);
	cloudYoff = p.random(50, 500);
	cloudMovementX = p.random(50, 500);
	cloudMovementY = p.random(50, 500);
}

function generatePoints() {
	for (var i = 0; i < pointCount; i++) {
		for (var j = 0; j < pointCount; j++) {
			p.append(points, new Point(i * pointGap, 0, j * pointGap, pointSize));
		}
	}
}

function generateGrid() {
	var material = new THREE.LineBasicMaterial();
	material.color = new THREE.Color(gridColor.x, gridColor.y, gridColor.z);

	var geometry = new THREE.Geometry();
	geometry.vertices.push(	
		new THREE.Vector3(points[points.length - 1].pos.x, gridHeight, points[points.length - 1].pos.z),
		new THREE.Vector3(points[points.length - 1].pos.x, gridHeight, points[0].pos.z),
		new THREE.Vector3(points[0].pos.x, gridHeight, points[0].pos.z),
		new THREE.Vector3(points[0].pos.x, gridHeight, points[points.length - 1].pos.z),
		new THREE.Vector3(points[points.length - 1].pos.x, gridHeight, points[points.length - 1].pos.z)
	);
	
	var line = new THREE.Line(geometry, material);
	scene.add(line);
}

initializeBiomes();
initializeColors();
initializeCloudNoise();
generatePoints();
generateGrid();