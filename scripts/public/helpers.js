function easeValue(val, target, ease) {
	val += ((target - val) * ease);
	return val;
}

function easeValueVector(val, target, ease) {
	var valX = easeValue(val.x, target.x, ease);
	var valY = easeValue(val.y, target.y, ease);
	var valZ = easeValue(val.z, target.z, ease);;
	return p.createVector(valX, valY, valZ);
}

function colorLerp(v1, v2, q) {
	var x = p.lerp(v1.x, v2.x, q);
	var y = p.lerp(v1.y, v2.y, q);
	var z = p.lerp(v1.z, v2.z, q);
	return p.createVector(x, y, z);
}

function sortAscending(a, b) {
	return a - b;
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');

	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function htmlspecialchars_decode(text) {
    var map = {
        '&amp;': '&',
        '&#038;': "&",
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'",
        '&#8217;': "’",
        '&#8216;': "‘",
        '&#8211;': "–",
        '&#8212;': "—",
        '&#8230;': "…",
        '&#8221;': '”'
    };

    return text.replace(/\&[\w\d\#]{2,5}\;/g, function(m) { return map[m]; });
}