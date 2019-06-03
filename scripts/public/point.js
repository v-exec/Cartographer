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
	this.heightmul;

	this.nature = function(p, v, c, w, h) {
		this.peakColor = p;
		this.valleyColor = v;
		this.cityColor = c;
		this.waterColor = w;
		this.heightMul = h;
	}

	this.update = function(newY) {
		this.pos.y = newY;

		if (this.pos.y > currentWaterHeight) this.pos.y = currentWaterHeight;

		//get sphere color
		if (this.isCloud) {
			fill(currentCloud.x, currentCloud.y, currentCloud.z);
		} else if (this.pos.y == currentWaterHeight) {
			fill(this.waterColor.x, this.waterColor.y, this.waterColor.z);
		} else if (this.isBuilding) {
			fill(this.cityColor.x, this.cityColor.y, this.cityColor.z);
		} else {
			var colorR = map(this.pos.y, gridHeight - this.heightMul * 0.8, gridHeight - this.heightMul * 0.1, this.peakColor.x, this.valleyColor.x, true);
			var colorG = map(this.pos.y, gridHeight - this.heightMul * 0.8, gridHeight - this.heightMul * 0.1, this.peakColor.y, this.valleyColor.y, true);
			var colorB = map(this.pos.y, gridHeight - this.heightMul * 0.8, gridHeight - this.heightMul * 0.1, this.peakColor.z, this.valleyColor.z, true);
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