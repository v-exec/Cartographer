//biomes - proper resolution, proper color assignment, border blending

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
		forestX += res;
		desertX += res;
		oceanX += res;
		alienX += res;

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
			forestY += res;
			desertY += res;
			oceanY += res;
			alienY += res;

			var index = i + (j * pointCount);

			//manage biomes
			var forestNoise = noise(forestX, forestY);
			var desertNoise = noise(desertX, desertY);
			var oceanNoise = noise(oceanX, oceanY);
			var alienNoise = noise(alienX, alienY);

			var biomeVal = [forestNoise, desertNoise, oceanNoise, alienNoise];
			biomeVal.sort(sortAscending);

			var chosenBiome = biomeVal[biomeVal.length - 1];

			// if (chosenBiome == forestNoise) {
			// 	heightMul = forest.heightMul;
			// 	//valleyColor = forest.valleyColor;
			// } else if (chosenBiome == desertNoise) {
			// 	heightMul = desert.heightMul;
			// 	//valleyColor = desert.valleyColor;
			// } else if (chosenBiome == oceanNoise) {
			// 	heightMul = ocean.heightMul;
			// 	//valleyColor = ocean.valleyColor;
			// } else if (chosenBiome == alienNoise) {
			// 	heightMul = alien.heightMul;
			// 	//valleyColor = alien.valleyColor;
			// }

			//make terrain
			var terrainNoise = (noise(x, y) * -heightMul) + heightLower;

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
				currentWaterHeight = lerp(waterHeight, gridHeight, map(mDistance, 0, originSize, 1, 0));
				points[index].update(lerp(terrainNoise, gridHeight, map(mDistance, 0, originSize, 1, 0)), false);
			} else {
				if (citySuccess) points[index].update(terrainNoise, true);
				else points[index].update(terrainNoise, false);
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
		currentValley = p5.Vector.lerp(valleyColor, p5.Vector.div(valleyColor, nightDarkness), sunset);
		currentPeak = p5.Vector.lerp(peakColor, p5.Vector.div(peakColor, nightDarkness), sunset);
		currentWater = p5.Vector.lerp(waterColor, p5.Vector.div(waterColor, nightDarkness), sunset);
		currentCity = p5.Vector.lerp(cityColor, p5.Vector.mult(cityColor, cityNightBrightness), sunset);
		currentCloud = p5.Vector.lerp(cloudColor, p5.Vector.div(cloudColor, nightDarkness), sunset);
	} else if (clock < -6 && clock > -8) {
		var sunrise = map(clock, -8, -6, 0, 1);
		currentValley = p5.Vector.lerp(p5.Vector.div(valleyColor, nightDarkness), valleyColor, sunrise);
		currentPeak = p5.Vector.lerp(p5.Vector.div(peakColor, nightDarkness), peakColor, sunrise);
		currentWater = p5.Vector.lerp(p5.Vector.div(waterColor, nightDarkness), waterColor, sunrise);
		currentCity = p5.Vector.lerp(p5.Vector.mult(cityColor, cityNightBrightness), cityColor, sunrise);
		currentCloud = p5.Vector.lerp(p5.Vector.div(cloudColor, nightDarkness), cloudColor, sunrise);
	} else {
		// currentValley = easeValueVector(currentValley, valleyColor, colorEase);
		// currentPeak = easeValueVector(currentPeak, peakColor, colorEase);
		// currentWater = easeValueVector(currentWater, waterColor, colorEase);
		// currentCity = easeValueVector(currentCity, cityColor, colorEase);
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