function Point (x, y, z, pointSize) {
	//set position so that it is centered on world origin
	this.pos = createVector(x - ((pointCount * pointGap) / 2) + pointGap, y, z - ((pointCount * pointGap) / 2));
	this.size = pointSize;
	this.isBuilding = false;

	//make postion locked to low resolution height
	this.update = function(newY, building) {
		this.pos.y = newY;
		this.isBuilding = building;
	}

	this.show = function() {
		//get sphere color depending on height
		if (this.pos.y == cloudHeight) {
			stroke(255);
		} else if (this.isBuilding) {
			stroke(cityColor.x, cityColor.y, cityColor.z);
		} else {
			var colorR = map(this.pos.y, heightMul * 0.1, heightMul * 0.9, peakColor.x, valleyColor.x, true);
			var colorG = map(this.pos.y, heightMul * 0.1, heightMul * 0.9, peakColor.y, valleyColor.y, true);
			var colorB = map(this.pos.y, heightMul * 0.1, heightMul * 0.9, peakColor.z, valleyColor.z, true);
			stroke(colorR, colorG, colorB);
		}

		//draw sphere
		push();
			translate(this.pos.x, this.pos.y, this.pos.z);
			sphere(this.size);
		pop();

		//add floors
		if (this.isBuilding) {
			for (var i = 0; i < floors; i++) {
				push();
					translate(this.pos.x, this.pos.y + i * floorHeight, this.pos.z);
					sphere(this.size);
				pop();
			}
		}
	}
}