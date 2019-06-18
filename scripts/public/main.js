function animate() {
	setupCamera();

	manageClouds();
	passTime();

	moveMap();
	updatePoints();

	for (var i = 0; i < stories.length; i++) {
		stories[i].show();
	}

	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();

function setupCamera() {
	camera.lookAt(new THREE.Vector3(0, cameraAngle, 0));

	camera.position.x = -camZoom;
	camera.position.z = camZoom;
	camera.position.y = camHeight;
}

//disable touch-based screen dragging
function touchMoved() {
	return false;
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
			var forestNoise = p.noise(forestX, forestY);
			var desertNoise = p.noise(desertX, desertY);
			var oceanNoise = p.noise(oceanX, oceanY);
			var alienNoise = p.noise(alienX, alienY);

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

			if (p.abs(biomeDifference) < biomeBlendThreshold) resultBiome = blendBiomes(chosenBiome, secondaryBiome, p.map(biomeDifference, -biomeBlendThreshold, biomeBlendThreshold, 1, 0, true));
			else resultBiome = chosenBiome;

			points[index].nature(resultBiome.peakColor, resultBiome.valleyColor, resultBiome.cityColor, resultBiome.waterColor, resultBiome.heightMul);

			//make terrain
			var terrainNoise = (p.noise(x, y) * -resultBiome.heightMul);
			points[index].isBuilding = false;
			points[index].isCloud = false;

			//add cities
			var newNoise = terrainNoise;
			if (p.noise(cityX, cityY) < resultBiome.cityChance) {
				for (var k = 0; k < heightLayers; k++) {
					if (terrainNoise > cityGap * k) newNoise = (cityGap * cityMul) * k;
				}
				points[index].isBuilding = true;
			}
			if (points[index].isBuilding) terrainNoise = newNoise;

			//add clouds
			if (p.noise(cloudX, cloudY) < resultBiome.currentClouds) {
				terrainNoise = -cloudHeight;
				points[index].isBuilding = false;
				points[index].isCloud = true;
			}

			//make origin
			var mDistance = p.dist(0, 0, xOff, yOff);
			if (mDistance < originSize) {
				points[index].isBuilding = false;
				points[index].isCloud = false;

				currentWaterHeight = p.lerp(resultBiome.waterHeight, gridHeight, p.map(mDistance, 0, originSize, 1, 0));
				points[index].update(p.lerp(terrainNoise, gridHeight - 1, p.map(mDistance, 0, originSize, 1, 0)));
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

	if (p.keyIsDown(p.LEFT_ARROW)) {
		currentX = easeValue(currentX, -speed, movementEase);
		xMovement = true;
	}
	
	if (p.keyIsDown(p.RIGHT_ARROW)) {
		currentX = easeValue(currentX, speed, movementEase);
		xMovement = true;
	}
	
	if (p.keyIsDown(p.DOWN_ARROW)) {
		currentY = easeValue(currentY, -speed, movementEase);
		yMovement = true;
	}
	
	if (p.keyIsDown(p.UP_ARROW)) {
		currentY = easeValue(currentY, speed, movementEase);
		yMovement = true;
	}

	//touch support
	if (p.touches[0]) {
		if (currentTouch) previousTouch = p.createVector(currentTouch.x, currentTouch.y);
		else previousTouch = p.createVector(p.touches[0].x, p.touches[0].y);

		currentTouch = p.createVector(p.touches[0].x, p.touches[0].y);

		if (previousTouch.equals(currentTouch)) {
			//
		} else {
			var horz = (previousTouch.x - currentTouch.x) * touchDampen;
			var vert = (currentTouch.y - previousTouch.y) * touchDampen;

			currentX = easeValue(currentX, horz - vert, movementEase);
			xMovement = true;
			currentY = easeValue(currentY, vert + horz, movementEase);
			yMovement = true;
		}
	} else if (currentTouch) previousTouch = p.createVector(currentTouch.x, currentTouch.y);

	if (!xMovement) currentX = easeValue(currentX, 0, movementEase);
	if (!yMovement) currentY = easeValue(currentY, 0, movementEase);

	var movement = p.createVector(currentX, currentY);
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

	p.select('#easttext').html(p.nf(xOff / 10, 0, 1));
	p.select('#northtext').html(p.nf(yOff / 10, 0, 1));
}

//clear touch data on touch end
window.addEventListener("touchend", touchEnd, false);

function touchEnd(evt) {
	currentTouch = null;
	previousTouch = null;
}

function handleInput(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		var input = inputBox.value;
		if (input == '') return;

		inputBox.value = null;

		//check for nearby pins
		var near = false;
		for (var i = 0; i < stories.length; i++) {
			if (p.dist(stories[i].pos.x, stories[i].pos.y, xOff, yOff) < pinDistance) near = true;
		}

		//create new pin - server save
		if (p.dist(xOff, yOff, 0, 0) > pinOriginDistance) {
			if (!near) {
				if (storyReady) {
					var h = p.hour();
					var m = p.minute();

					if (m < 10) m = '0' + m;
					if (h == 12) h = h + ':' + m + 'pm';
					else if (h > 12) h = (h - 12) + ':' + m + 'pm';
					else h = h + ':' + m + 'am';
					
					var time = p.day() + '/' + p.month() + '/' + p.year() + ' - ' + h;

					storyReady = false;

					//send new pin to server, and create local copy if live updates are off
					issueRequest(input, time, xOff, yOff);
					if (!liveUpdate) p.append(stories, new Story(xOff, yOff, input, time));	

					setTimeout(function() {
						storyReady = true;
					}, postIntervalLimit);
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
	cloudXoff += p.map(p.noise(cloudMovementX), 0, 1, -cloudSpeedMax, cloudSpeedMax);
	cloudYoff += p.map(p.noise(cloudMovementY), 0, 1, -cloudSpeedMax, cloudSpeedMax);
}

function passTime() {
	clock += clockSpeed;
	if (clock > 12) clock = -12;

	if (clock > 6 && clock < 8) {
		var sunset = p.map(clock, 6, 8, 0, 1);
		biomeSunset(forest, sunset);
		biomeSunset(desert, sunset);
		biomeSunset(ocean, sunset);
		biomeSunset(alien, sunset);
		currentCloud = p5.Vector.lerp(cloudColor, p5.Vector.div(cloudColor, nightDarkness), sunset);

	} else if (clock < -6 && clock > -8) {
		var sunrise = p.map(clock, -8, -6, 0, 1);
		biomeSunrise(forest, sunrise);
		biomeSunrise(desert, sunrise);
		biomeSunrise(ocean, sunrise);
		biomeSunrise(alien, sunrise);
		currentCloud = p5.Vector.lerp(p5.Vector.div(cloudColor, nightDarkness), cloudColor, sunrise);
	}
}

//update stories continuously
setInterval(function() {
	if (liveUpdate) updateStories();
}, updateInterval);