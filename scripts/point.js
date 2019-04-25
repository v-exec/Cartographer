function Point (x, y, z, pointSize) {
	//set position so that it is centered on world origin
	this.pos = createVector(x - ((pointCount * pointGap) / 2) + pointGap, y, z - ((pointCount * pointGap) / 2));
	this.size = pointSize;
	this.isBuilding = false;
	this.isCloud = false;

	this.update = function(newY) {
		this.pos.y = newY;

		if (this.pos.y > currentWaterHeight) this.pos.y = currentWaterHeight;

		//get sphere color depending on height
		if (this.isCloud) {
			fill(currentCloud.x, currentCloud.y, currentCloud.z);
		} else if (this.pos.y == currentWaterHeight) {
			fill(currentWater.x, currentWater.y, currentWater.z);
		} else if (this.isBuilding) {
			fill(currentCity.x, currentCity.y, currentCity.z);
		} else {
			var colorR = map(this.pos.y, heightMul * 0.1, heightMul * 0.9, currentPeak.x, currentValley.x, true);
			var colorG = map(this.pos.y, heightMul * 0.1, heightMul * 0.9, currentPeak.y, currentValley.y, true);
			var colorB = map(this.pos.y, heightMul * 0.1, heightMul * 0.9, currentPeak.z, currentValley.z, true);
			fill(colorR, colorG, colorB);
		}

		//draw sphere
		push();
			translate(this.pos.x, this.pos.y, this.pos.z);
			sphere(this.size, sphereDetail, sphereDetail);
		pop();

		//add floors
		if (this.isBuilding) {
			push();
				translate(this.pos.x, this.pos.y + ((i + 1) * floorHeight), this.pos.z);
				sphere(this.size, sphereDetail, sphereDetail);
			pop();
			for (var i = 0; i < floors; i++) {
				push();
					translate(this.pos.x, this.pos.y - ((i + 1) * floorHeight), this.pos.z);
					sphere(this.size, sphereDetail, sphereDetail);
				pop();
			}
		}
	}
}