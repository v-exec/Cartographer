function Story (x, y, storyText, time) {
	this.pos = p.createVector(x, y);
	this.loaded = false;
	this.time = time;

	var geometry = new THREE.ConeGeometry(storyScale, storyScale * 2.2, 6);
	var material = new THREE.MeshBasicMaterial();
	material.color = new THREE.Color(storyPinColor.x, storyPinColor.y, storyPinColor.z);
	this.cone = new THREE.Mesh(geometry, material);
	this.cone.rotation.x = p.PI;
	this.text;
	this.timeText;

	this.show = function() {
		if ((p.abs(xOff - this.pos.x) < storyMapSize) && (p.abs(yOff - this.pos.y) < storyMapSize)) {
			if (!this.loaded) {
				this.createText();
				this.loaded = true;
			}

			var distX = xOff - this.pos.x;
			var distY = yOff - this.pos.y;

			this.cone.position.x = -distY * storyParallax;
			this.cone.position.y = storyHeight;
			this.cone.position.z = -distX * storyParallax;

			this.text.position.x = this.cone.position.x;
			this.text.position.y = this.cone.position.y + textDistance;
			this.text.position.z = this.cone.position.z;
			this.text.lookAt(camera.position);

			this.timeText.position.x = this.cone.position.x;
			this.timeText.position.y = this.cone.position.y + timeDistance;
			this.timeText.position.z = this.cone.position.z;
			this.timeText.lookAt(camera.position);

			if (this.cone.parent !== scene) {
				scene.add(this.cone);
				scene.add(this.text);
				scene.add(this.timeText);
			}
		} else if (this.cone.parent === scene) {
			scene.remove(this.cone);
			scene.remove(this.text);
			scene.remove(this.timeText);
		}
	}

	this.createText = function() {
		var textGeometry = new THREE.TextGeometry(htmlspecialchars_decode(storyText), {
			font: customFont,
			size: fontScale,
			height: 0,
			curveSegments: 3,
			bevelEnabled: false
		});
		textGeometry.center();

		var timeGeometry = new THREE.TextGeometry(time, {
			font: customFont,
			size: fontScale,
			height: 0,
			curveSegments: 3,
			bevelEnabled: false
		});
		timeGeometry.center();

		var textMaterial = new THREE.MeshBasicMaterial();
		textMaterial.color = new THREE.Color(storyTextColor.x, storyTextColor.y, storyTextColor.z);
		this.text = new THREE.Mesh(textGeometry, textMaterial);
		this.text.rotation.y = -p.PI / 4;
		this.timeText = new THREE.Mesh(timeGeometry, textMaterial);
		this.timeText.rotation.y = -p.PI / 4;
	}
}