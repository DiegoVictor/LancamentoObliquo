/**
 * Class Calc
 *
 * Make calculations to get vx, vy, Amax and
 * Hmax, also to get a position based in t (time)
 **/
 var Calc = {
	name: 'Calc',

	// Show launch data on screen
	show: function (dataName, draw) {
		var middle = Calc.data.Amax / 2;

		switch (dataName) {
			case 'hmax':
				draw(function (Projectile, Utils) {
					var data = {
						x: middle + Utils.margin + Projectile.r,
						y: Utils.floor_y - Calc.data.Hmax - Projectile.r
					};

					this.ctx.setLineDash([5, 5]);
					this.ctx.textAlign = 'center';
					this.ctx.lineWidth = 1;

					this.ctx.moveTo(0, data.y);
					this.ctx.lineTo(data.x, data.y);
					this.ctx.lineTo(data.x, Utils.floor_y);
					this.ctx.stroke();

					this.ctx.fillText(
						Calc.data.Hmax.toFixed(2),
						data.x / 2, data.y - 5
					);
				});
				break;

			case 'position':
				this.canvas.clear();
				this.ctx.font = '11px Consolas';
				this.ctx.fillStyle = 'white';

				draw(function (Projectile, Utils) {
					var position = {'x': Projectile.x, 'y': Utils.floor_y - Projectile.y};
					Object.keys(position).forEach(function (key, i) {
						var r = -Projectile.r;

						Calc.ctx.textAlign = 'end';
						if (Projectile.x >= middle) {
							Calc.ctx.textAlign = 'start';
							r *= -2;
						}

						Calc.ctx.fillText(
							key.toUpperCase() + ':' + position[key].toFixed(2),
							Projectile.x + Utils.margin + r,
							Projectile.y - 15 * (i + 1)
						);
					});
				});
				break;

			case 'velocity':
				draw(function (Utils, floor_y, t) {
					this.canvas.clear();
					this.ctx.fillStyle = 'white';
					this.ctx.font = '14px Consolas';
					this.ctx.textAlign = 'end';

					this.ctx.save();
					this.ctx.translate(window.innerWidth - 12, 0);
					this.ctx.rotate(-89 * Math.PI / 180);
					this.ctx.fillText(
						'vy: ' +  (Calc.data.vy - (Utils.g * t)).toFixed(2),
						-window.innerHeight / 2 + floor_y, 10
					);
					this.ctx.restore();
				});
				break;
		}
	},

	// Calculate a position based in t (time)
	pos: function (t, floor_y) {
		var data = this.data;
		return {
			x: (function (x) {
				if (x > data.Amax) {
					x = data.Amax;
				}

				return x;
			}(data.vx * t)),

			y: (function (y) {
				if (y < 0) {
					y = 0;
				}

				return floor_y - y;
			}(data.vy * t - (data.g * Math.pow(t, 2) / 2)))
		}
	},

	// Calculate some parameters like:
	// vx, vy, Amax and Hmax
	prepare: function (v0, ang, g) {
		return {
			g: g,
			ang: (ang * 180 / Math.PI).toFixed(2), // angle in degrees
			Amax: (Math.sin(2 * ang) * Math.pow(v0, 2)) / g,
			Hmax: (function () {
				var vy =  v0 * Math.sin(ang);
				return Math.pow(vy, 2) * (1 / g - 1 / (2 * g));
			}()),
			v0: v0,
			vx: v0 * Math.cos(ang),
			vy: v0 * Math.sin(ang)
		};
	}
};
