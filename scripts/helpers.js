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

function sortAscending(a, b) {
	return a - b;
}