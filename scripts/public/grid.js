function Grid () {
	this.show = function() {
		fill(gridColor.x, gridColor.y, gridColor.z);

		//top right
		push();
			translate(points[0].pos.x, gridHeight, points[0].pos.z + ((pointCount * pointGap) / 2) - (pointGap / 2));
			box(gridLine, gridLine, pointCount * pointGap - pointGap);
		pop();

		//top left
		push();
			translate(points[0].pos.x + ((pointCount * pointGap) / 2) - (pointGap / 2), gridHeight, points[0].pos.z);
			box(pointCount * pointGap - pointGap, gridLine, gridLine);
		pop();

		//bottom right
		push();
			translate(points[points.length - 1].pos.x - ((pointCount * pointGap) / 2 - (pointGap / 2)), gridHeight, points[points.length - 1].pos.z);
			box(pointCount * pointGap - pointGap, gridLine, gridLine);
		pop();

		//bottom left
		push();
			translate(points[points.length - 1].pos.x, gridHeight, points[points.length - 1].pos.z - ((pointCount * pointGap) / 2 - (pointGap / 2)));
			box(gridLine, gridLine, pointCount * pointGap - pointGap);
		pop();
	}
}