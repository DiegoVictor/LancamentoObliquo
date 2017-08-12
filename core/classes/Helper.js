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
				this.update(Calc.pos(this.t, floor_y)).arc();

				this.t += this.step;
			} while (this.x < Calc.data.Amax && this.t < t);
		}
	},

	// Update object position
	update: function (p) {
		this.x = 0;
		if (!isNaN(p.x)) {
			this.x = p.x;
		}

		this.y = p.y;
		return this;
	}
};
