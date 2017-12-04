var Helper = {
	// Reusable draw method
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

	// Update object position
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
