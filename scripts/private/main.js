function preload() {
	storyFont = loadFont('assets/Comfortaa-Bold.otf');
	storyJSON = loadJSON('stories/stories.json');
	storyData = storyJSON['stories'];
	inputBox = document.getElementById('inputBox');
}

function setup() {
	var canvas = createCanvas(size, size, WEBGL);
	canvas.parent(document.getElementById('canvasParent'));

	noStroke();

	initializeBiomes();
	initializeColors();
	initializeCloudNoise();
	generatePoints();
	generateStories();
}

function draw() {
	background(34);

	setupCamera();
	grid.show();

	manageClouds();
	passTime();

	moveMap();
	updatePoints();

	for (var i = 0; i < stories.length; i++) {
		stories[i].show();
	}
}

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
		forestX += res / biomeSize;
		desertX += res / biomeSize;
		oceanX += res / biomeSize;
		alienX += res / biomeSize;

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
			forestY += res / biomeSize;
			desertY += res / biomeSize;
			oceanY += res / biomeSize;
			alienY += res / biomeSize;

			var index = i + (j * pointCount);

			//manage biomes
			var forestNoise = noise(forestX, forestY);
			var desertNoise = noise(desertX, desertY);
			var oceanNoise = noise(oceanX, oceanY);
			var alienNoise = noise(alienX, alienY);

			//find chosen biome(s)
			var biomeVal = [forestNoise, desertNoise, oceanNoise, alienNoise];
			biomeVal.sort(sortAscending);

			var chosenBiomeValue = biomeVal[biomeVal.length - 1];
			var secondaryBiomeValue = biomeVal[biomeVal.length - 2];
			var tirtiaryBiomeValue = biomeVal[biomeVal.length - 3];
			var chosenBiome;
			var secondaryBiome;
			var tirtiaryBiome;

			if (chosenBiomeValue == forestNoise) chosenBiome = forest;
			else if (chosenBiomeValue == desertNoise) chosenBiome = desert;
			else if (chosenBiomeValue == oceanNoise) chosenBiome = ocean;
			else if (chosenBiomeValue == alienNoise) chosenBiome = alien;

			if (secondaryBiomeValue == forestNoise) secondaryBiome = forest;
			else if (secondaryBiomeValue == desertNoise) secondaryBiome = desert;
			else if (secondaryBiomeValue == oceanNoise) secondaryBiome = ocean;
			else if (secondaryBiomeValue == alienNoise) secondaryBiome = alien;

			if (tirtiaryBiomeValue == forestNoise) tirtiaryBiome = forest;
			else if (tirtiaryBiomeValue == desertNoise) tirtiaryBiome = desert;
			else if (tirtiaryBiomeValue == oceanNoise) tirtiaryBiome = ocean;
			else if (tirtiaryBiomeValue == alienNoise) tirtiaryBiome = alien;

			//blend biomes
			var resultBiome;
			var biomeDifference = chosenBiomeValue - secondaryBiomeValue;

			if (abs(biomeDifference) < biomeBlendThreshold) resultBiome = blendBiomes(chosenBiome, secondaryBiome, map(biomeDifference, -biomeBlendThreshold, biomeBlendThreshold, 1, 0, true));
			else resultBiome = chosenBiome;

			points[index].nature(resultBiome.peakColor, resultBiome.valleyColor, resultBiome.cityColor, resultBiome.waterColor, resultBiome.heightMul);

			//make terrain
			var terrainNoise = (noise(x, y) * -resultBiome.heightMul) + heightLower;
			points[index].isBuilding = false;
			points[index].isCloud = false;

			//add cities
			var newNoise = terrainNoise;
			if (noise(cityX, cityY) < resultBiome.cityChance) {
				for (var k = 0; k < heightLayers; k++) {
					if (terrainNoise > cityGap * k) newNoise = (cityGap * cityMul) * k;
				}
				points[index].isBuilding = true;
			}
			if (points[index].isBuilding) terrainNoise = newNoise;

			//add clouds
			if (noise(cloudX, cloudY) < resultBiome.currentClouds) {
				terrainNoise = -cloudHeight;
				points[index].isBuilding = false;
				points[index].isCloud = true;
			}

			//make origin
			var mDistance = dist(0, 0, xOff, yOff);
			if (mDistance < originSize) {
				points[index].isBuilding = false;
				points[index].isCloud = false;

				currentWaterHeight = lerp(resultBiome.waterHeight, gridHeight, map(mDistance, 0, originSize, 1, 0));
				points[index].update(lerp(terrainNoise, gridHeight - 1, map(mDistance, 0, originSize, 1, 0)));
			} else {
				currentWaterHeight = resultBiome.waterHeight;
				points[index].update(terrainNoise);
			}
		}
	}
}

function moveMap() {
	var xMovement = false;
	var yMovement = false;

	if (keyIsDown(LEFT_ARROW)) {
		currentX = easeValue(currentX, -speed, movementEase);
		xMovement = true;
	}
	
	if (keyIsDown(RIGHT_ARROW)) {
		currentX = easeValue(currentX, speed, movementEase);
		xMovement = true;
	}
	
	if (keyIsDown(DOWN_ARROW)) {
		currentY = easeValue(currentY, -speed, movementEase);
		yMovement = true;
	}
	
	if (keyIsDown(UP_ARROW)) {
		currentY = easeValue(currentY, speed, movementEase);
		yMovement = true;
	}

	if (!xMovement) currentX = easeValue(currentX, 0, movementEase);
	if (!yMovement) currentY = easeValue(currentY, 0, movementEase);

	var movement = createVector(currentX, currentY);
	movement.limit(speed);

	xOff += movement.x;
	yOff += movement.y;
	cityXoff += movement.x;
	cityYoff += movement.y;
	cloudXoff += movement.x;
	cloudYoff += movement.y;

	forest.x += movement.x / biomeSize;
	forest.y += movement.y / biomeSize;
	ocean.x += movement.x / biomeSize;
	ocean.y += movement.y / biomeSize;
	desert.x += movement.x / biomeSize;
	desert.y += movement.y / biomeSize;
	alien.x += movement.x / biomeSize;
	alien.y += movement.y / biomeSize;

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
				if (!storyReady) {
					var h = hour();
					var m = minute();

					if (m < 10) m = '0' + m;
					if (h == 12) h = h + ':' + m + 'pm';
					else if (h > 12) h = (h - 12) + ':' + m + 'pm';
					else h = h + ':' + m + 'am';
					
					var time = day() + '/' + month() + '/' + year() + ' - ' + h;
					
					var newJSON = {};
					newJSON.x = xOff;
					newJSON.y = yOff;
					newJSON.text = input;
					newJSON.time = time;

					storyReady = false;

					append(storyJSON['stories'], newJSON);
					issueRequest(JSON.stringify(storyJSON));
				} else {
					inputBox.placeholder = 'multiple pins placed too quickly';
					setTimeout(function() {
						inputBox.placeholder = 'pin';
					}, 3000);
				}
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

	forest.clouds(cloudiness);
	desert.clouds(cloudiness);
	ocean.clouds(cloudiness);
	alien.clouds(cloudiness);

	cloudMovementX += windChaos;
	cloudMovementY += windChaos;
	cloudXoff += map(noise(cloudMovementX), 0, 1, -cloudSpeedMax, cloudSpeedMax);
	cloudYoff += map(noise(cloudMovementY), 0, 1, -cloudSpeedMax, cloudSpeedMax);
}

function passTime() {
	clock += clockSpeed;
	if (clock > 12) clock = -12;

	if (clock > 6 && clock < 8) {
		var sunset = map(clock, 6, 8, 0, 1);
		biomeSunset(forest, sunset);
		biomeSunset(desert, sunset);
		biomeSunset(ocean, sunset);
		biomeSunset(alien, sunset);
		currentCloud = p5.Vector.lerp(cloudColor, p5.Vector.div(cloudColor, nightDarkness), sunset);

	} else if (clock < -6 && clock > -8) {
		var sunrise = map(clock, -8, -6, 0, 1);
		biomeSunrise(forest, sunrise);
		biomeSunrise(desert, sunrise);
		biomeSunrise(ocean, sunrise);
		biomeSunrise(alien, sunrise);
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

var apiPath = 'https://exp.v-os.ca/cartographer/scripts/public/writer.php';

function issueRequest(sText) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', apiPath, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
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
	var k = document.getElementById('k').className;
	var t = getCookie('t');
	xhr.send(encodeURI('k=' + k + '&t=' + t + '&text=' + sText));
}

//update the stories every second
setInterval(function() {
	if (updateStories()) {
		storyJSON = loadJSON('assets/stories.json', updateStories());
	}
}, 1000);

setInterval(function() {
	storyReady = true;
}, 10000);