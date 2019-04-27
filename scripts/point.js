function Point (x, y, z, pointSize) {
	//set position so that it is centered on world origin
	this.pos = createVector(x - ((pointCount * pointGap) / 2) + pointGap, y, z - ((pointCount * pointGap) / 2));
	this.size = pointSize;

	this.isBuilding = false;
	this.isCloud = false;

	this.peakColor;
	this.valleyColor;
	this.cityColor;
	this.waterColor;
	this.waterHeight;
	this.heightMul;

	this.colors = function(p, v, c, w, wh, h) {
		this.peakColor = p;
		this.valleyColor = v;
		this.cityColor = c;
		this.waterColor = w;
		this.waterHeight = wh;
		this.heightMul = h;
	}

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
			var colorR = map(this.pos.y, gridHeight - heightMul * 0.8, gridHeight - heightMul * 0.2, currentPeak.x, currentValley.x, true);
			var colorG = map(this.pos.y, gridHeight - heightMul * 0.8, gridHeight - heightMul * 0.2, currentPeak.y, currentValley.y, true);
			var colorB = map(this.pos.y, gridHeight - heightMul * 0.8, gridHeight - heightMul * 0.2, currentPeak.z, currentValley.z, true);
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