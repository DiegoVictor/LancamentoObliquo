/**
 * Object Preview
 *
 * Draw the projectile
 **/
 var Projectile = {
	name: 'Projectile',
	x: 0,
	r: 4, // projectile radius

	/**
	 * Draw projectile
	 *
	 * @see Simulator.js:13
	 **/
	draw: function () {
		this.canvas.clear();
		this.ctx.strokeStyle = 'white';
		this.arc();
	}
};
