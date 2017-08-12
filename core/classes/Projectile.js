/**
 * Object Preview
 *
 * Draw the projectile
 **/
 var Projectile = {
	name: 'Projectile',
	x: 0,
	r: 4, // projectile radius

	draw: function () {
		this.canvas.clear();
		this.ctx.strokeStyle = 'white';
		this.arc();
	},

	reset: function (y) {
		this.update({y: y}).draw();
	}
};
