/**
 * Object Helper
 *
 * Group some usefull processes
 * (Used by Projectile, Preview and Track)
 **/
var Helper = {
	/**
	 * Draw a path using a lot of arcs
	 * (Used only by Preview and Track)
	 *
	 * @param {Number} t - (Optional) Sum of step limit
	 **/
	draw: function (t) {
		if (this.show) {
			var time = null;
			
			this.x = 0;
			if (this.name === 'Preview') {
				this.t = 0;
				this.canvas.clear();
				time = t;
			}
			
			while (this.updateState(time)) { // @see Simulator.js:23
				this.t += this.step;
				this.arc();
			}
		}
	},

	/**
	 * Update caller position 
	 * (used only by Projectile, Preview and Track)
	 *
	 * @param {Object} p - Object position (e.g. {x: 234, y: 452})
	 * @param {Number} y - Utils.floor_y
	 * @return {Object} object - This (chain purposes)
	 **/
	update: function (p, y) {
		this.x = 0;
		if (!isNaN(p.x)) {
			this.x = p.x;
		}

		this.y = p.y;
		if (typeof y === 'number') {
			this.y = y - p.y;
		}
		return this;
	}
};
