var Helper = {
	// Reusable draw method
	draw: function (Calc, floor_y, t) {
		if (this.show) {
			if (this.name === 'Preview') {
				this.t = 0;
				t = Calc.data.Amax / this.step;
			}

			if (this.t === 0) {
				this.canvas.clear();
			}

			do {

				this.t += this.step;
			} while (this.x < Calc.data.Amax && this.t < t);
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
