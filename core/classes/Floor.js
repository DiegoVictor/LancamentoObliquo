/**
 * Object Floor
 *
 * Draw the simulator's floor and the scale
 **/
 var Floor = {
	name: 'Floor',
	scale: 100, // pixels between every scale point
	unit: 100, // scale's unit
	y: 35, // Indicates where the floor starts

	draw: function (y, length, starting_point) {
		this.canvas.clear();
		this.ctx.lineWidth = 2;

		this.ctx.moveTo(0, y);
		this.ctx.lineTo(length, y);

		this.ctx.strokeStyle = 'white';
		this.ctx.stroke();

		// Draw the scale
		this.ctx.fillStyle = 'white';
		this.ctx.font = '11px Consolas';
		for (var i = 0; i < length / this.scale; i++) {
			this.ctx.fillText(
				i * this.unit, starting_point + i * this.scale,
				y + 12
			);
		}
	}
};
