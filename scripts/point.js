function Point (x, y, z, pointSize) {
	//set position so that it is centered on world origin
	this.pos = createVector(x - ((pointCount * pointGap) / 2) + pointGap, y, z - ((pointCount * pointGap) / 2));
	this.size = pointSize;

	//make postion locked to low resolution height
	this.update = function(newY) {
		var y;

		if (makeGaps) {
			for (var i = 0; i < 10; i++) {
				if (newY > heightGap * i + 1) y = heightGap * i;
			}
		} else y = newY;

		this.pos.y = y;
	}

	this.show = function() {
		//get sphere color depending on height
		var colorR = map(this.pos.y, heightMul * 0.1, heightMul * 0.9, peak.x, valley.x, true);
		var colorG = map(this.pos.y, heightMul * 0.1, heightMul * 0.9, peak.y, valley.y, true);
		var colorB = map(this.pos.y, heightMul * 0.1, heightMul * 0.9, peak.z, valley.z, true);
		stroke(colorR, colorG, colorB);

		//draw sphere
		push();
			translate(this.pos.x, this.pos.y, this.pos.z);
			sphere(this.size);
		pop();

		//draw lower spheres
		if (drawLowSpheres) {
			if (this.pos.y >= heightGap) {
				var layers = this.pos.y / heightGap;

				for (var i = 0; i < layers - 1; i++) {
					//get lower sphere color
					var colorLowR = map(this.pos.y - i * heightGap, heightMul * 0.1, heightMul * 0.9, valley.x, peak.x, true);
					var colorLowG = map(this.pos.y - i * heightGap, heightMul * 0.1, heightMul * 0.9, valley.y, peak.y, true);
					var colorLowB = map(this.pos.y - i * heightGap, heightMul * 0.1, heightMul * 0.9, valley.z, peak.z, true);
					stroke(colorLowR, colorLowG, colorLowB);

					//draw lower sphere
					push();
						translate(this.pos.x, this.pos.y - i * heightGap, this.pos.z);
						sphere(this.size);
					pop();
				}
			}
		}
	}
}