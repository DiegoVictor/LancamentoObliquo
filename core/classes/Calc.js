/**
 * Class Calc
 *
 * Make calculations to get vx, vy, Amax and
 * Hmax, also to get a position based in t (time)
 **/
 var Calc = {
	name: 'Calc',

	pos: function (t) {
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

				return y;
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
