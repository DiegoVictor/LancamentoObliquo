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

	draw: function (Utils) {
		this.canvas.clear();
		this.ctx.lineWidth = 2;

		this.ctx.moveTo(0, Utils.floor_y);
		this.ctx.lineTo(Utils.width, Utils.floor_y);

		this.ctx.strokeStyle = 'white';
		this.ctx.stroke();

		// Draw the scale
		this.ctx.fillStyle = 'white';
		this.ctx.font = '11px Consolas';
		for (var i = 0; i < Utils.width / this.scale; i++) {
			this.ctx.fillText(
				i * this.unit, Utils.margin + i * this.scale,
				Utils.floor_y + 12
			);
		}
	}
};
