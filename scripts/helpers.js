function easeValue(val, target, ease) {
	val += ((target - val) * ease);
	return val;
}

function easeValueVector(val, target, ease) {
	var valX = easeValue(val.x, target.x, ease);
	var valY = easeValue(val.y, target.y, ease);
	var valZ = easeValue(val.z, target.z, ease);;
	return createVector(valX, valY, valZ);
}

function colorLerp(v1, v2, q) {
	var x = lerp(v1.x, v2.x, q);
	var y = lerp(v1.y, v2.y, q);
	var z = lerp(v1.z, v2.z, q);
	return createVector(x, y, z);
}

function sortAscending(a, b) {
	return a - b;
}