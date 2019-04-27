function Biome (x, y, pc, vc, cc, wc, wh, hm, ch) {
	this.x = x;
	this.y = y;
	this.peakColor = pc;
	this.valleyColor = vc;
	this.cityColor = cc;
	this.waterColor = wc;
	this.waterHeight = wh;
	this.heightMul = hm;
	this.cityChance = ch;
}

function reassignBiome(biome) {
	heightMul = biome.heightMul;
	valleyColor = biome.valleyColor;
	peakColor = biome.peakColor;
	cityColor = biome.cityColor;
	waterColor = biome.waterColor;
	waterHeight = biome.waterHeight;
	cityThreshold = biome.cityChance;
}

function blendBiomes(b1, b2, q) {
	var newPeak = colorLerp(b1.peakColor, b2.peakColor, q);
	var newValley = colorLerp(b1.valleyColor, b2.valleyColor, q);
	var newCity = colorLerp(b1.cityColor, b2.cityColor, q);
	var newWater = colorLerp(b1.waterColor, b2.waterColor, q);
	var newWaterHeight = lerp(b1.waterHeight, b2.waterHeight, q);
	var newHeight = lerp(b1.heightMul, b2.heightMul, q);
	var newCityChance = lerp(b1.cityChance, b2.cityChance, q);
	return new Biome(0, 0, newPeak, newValley, newCity, newWater, newWaterHeight, newHeight, newCityChance);
}