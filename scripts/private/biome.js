function Biome (x, y, pc, vc, cc, wc, wh, hm, ch, lh) {
	this.x = x;
	this.y = y;

	this.truePeakColor = pc;
	this.peakColor = this.truePeakColor;
	this.trueValleyColor = vc;
	this.valleyColor = this.trueValleyColor;
	this.trueCityColor = cc;
	this.cityColor = this.trueCityColor;
	this.trueWaterColor = wc;
	this.waterColor = this.trueWaterColor;

	this.waterHeight = wh;
	this.heightMul = hm;
	this.cityChance = ch;
	this.cloudChance = lh;
	this.currentClouds;

	this.clouds = function(c) {
		this.currentClouds = map(noise(c), 0, 1, 0, this.cloudChance);
	}
}

function blendBiomes(b1, b2, q) {
	var newPeak = colorLerp(b1.peakColor, b2.peakColor, q);
	var newValley = colorLerp(b1.valleyColor, b2.valleyColor, q);
	var newCity = colorLerp(b1.cityColor, b2.cityColor, q);
	var newWater = colorLerp(b1.waterColor, b2.waterColor, q);
	var newWaterHeight = lerp(b1.waterHeight, b2.waterHeight, q);
	var newHeight = lerp(b1.heightMul, b2.heightMul, q);
	var newCityChance = 0;
	var newCloudChance = lerp(b1.cloudChance, b2.cloudChance, q);
	return new Biome(0, 0, newPeak, newValley, newCity, newWater, newWaterHeight, newHeight, newCityChance, newCloudChance);
}

function biomeSunset(biome, s) {
	biome.peakColor = p5.Vector.lerp(biome.truePeakColor, p5.Vector.div(biome.truePeakColor, nightDarkness), s);
	biome.valleyColor = p5.Vector.lerp(biome.trueValleyColor, p5.Vector.div(biome.trueValleyColor, nightDarkness), s);
	biome.waterColor = p5.Vector.lerp(biome.trueWaterColor, p5.Vector.div(biome.trueWaterColor, nightDarkness), s);
	biome.cityColor = p5.Vector.lerp(biome.trueCityColor, p5.Vector.mult(biome.trueCityColor, cityNightBrightness), s);
}

function biomeSunrise(biome, s) {
	biome.peakColor = p5.Vector.lerp(p5.Vector.div(biome.truePeakColor, nightDarkness), biome.truePeakColor, s);
	biome.valleyColor = p5.Vector.lerp(p5.Vector.div(biome.trueValleyColor, nightDarkness), biome.trueValleyColor, s);
	biome.waterColor = p5.Vector.lerp(p5.Vector.div(biome.trueWaterColor, nightDarkness), biome.trueWaterColor, s);
	biome.cityColor = p5.Vector.lerp(p5.Vector.mult(biome.trueCityColor, cityNightBrightness), biome.trueCityColor, s);
}