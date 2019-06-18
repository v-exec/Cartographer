function Point (x, y, z, pointSize) {
	this.geometry = new THREE.CircleGeometry(pointSize, dotDetail);
	this.material = new THREE.MeshBasicMaterial();
	this.dot = new THREE.Mesh(this.geometry, this.material);

	//set position so that it is centered on world origin
	this.pos = p.createVector(x - ((pointCount * pointGap) / 2) + pointGap, y, z - ((pointCount * pointGap) / 2));
	this.dot.position.x = this.pos.x;
	this.dot.position.y = this.pos.y;
	this.dot.position.z = this.pos.z;

	scene.add(this.dot);

	this.floorDots = [];

	for (var i = 0; i < floors; i++) {
		var g = new THREE.CircleGeometry(pointSize, dotDetail);
		var m = new THREE.MeshBasicMaterial();
		var s = new THREE.Mesh(g, m);
		s.position.x = this.pos.x;
		s.position.z = this.pos.z;
		s.lookAt(camera.position);
		p.append(this.floorDots, s);
	}

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

		//get dot color
		if (this.isCloud) {
			this.dot.material.color = new THREE.Color(currentCloud.x, currentCloud.y, currentCloud.z);
		} else if (this.pos.y == currentWaterHeight) {
			this.dot.material.color = new THREE.Color(this.waterColor.x, this.waterColor.y, this.waterColor.z);
		} else if (this.isBuilding) {
			this.dot.material.color = new THREE.Color(this.cityColor.x, this.cityColor.y, this.cityColor.z);
		} else {
			var colorR = p.map(this.pos.y, gridHeight - this.heightMul * 0.8, gridHeight - this.heightMul * 0.1, this.peakColor.x, this.valleyColor.x, true);
			var colorG = p.map(this.pos.y, gridHeight - this.heightMul * 0.8, gridHeight - this.heightMul * 0.1, this.peakColor.y, this.valleyColor.y, true);
			var colorB = p.map(this.pos.y, gridHeight - this.heightMul * 0.8, gridHeight - this.heightMul * 0.1, this.peakColor.z, this.valleyColor.z, true);
			this.dot.material.color = new THREE.Color(colorR, colorG, colorB);
		}

		//translate height
		this.dot.position.y = -this.pos.y;
		this.dot.lookAt(camera.position);

		//add floors
		if (this.isBuilding) {
			for (var i = 0; i < floors; i++) {
				this.floorDots[i].position.y = -this.pos.y + ((i + 1) * floorHeight);
				this.floorDots[i].material.color = new THREE.Color(this.cityColor.x, this.cityColor.y, this.cityColor.z);
				this.floorDots[i].lookAt(camera.position);
				scene.add(this.floorDots[i]);
			}
		} else {
			for (var i = 0; i < floors; i++) {
				if (this.floorDots[i].parent === scene) scene.remove(this.floorDots[i]);
			}
		}
	}
}