var Simulator = {
	// Time between every loop's iterations (miliseconds)
	miliseconds: 30,
	interval: null, // Store the loop
	t: 0, // Launch time elapsed

	/**
	 * Starts everything that is necessary to simulator
	 * runs
	 **/
	init: function () {
		Utils.update(Floor.y);
		Helper.arc = function () {
			this.ctx.beginPath();
			this.ctx.arc(
				this.x + Utils.margin + Projectile.r,
				this.y - Projectile.r, this.r, -0.01, Math.PI * 2
			);
			this.ctx.strokeStyle = 'white';
			this.ctx.stroke();
		};

		Helper.updateState = function  (t) {
			var p = Calc.pos(this.t);
			p.y = Utils.floor_y - p.y;

			if (this.t < (t || Simulator.t) && this.x < Calc.data.Amax) {
				this.update(p);
				return true;
			}
			return false;
		};

		Projectile.y = Utils.floor_y;
		[Floor, Projectile, Preview, Track, Event]
		.forEach(function (o) {
			var canvas = $('<canvas id="'+o.name+'"></canvas>').prependTo('body');

			if (!isNaN(o.r)) {
				o.__proto__ = Helper;
			}

			o.canvas = canvas.get(0);
			o.ctx = o.canvas.getContext('2d');
			if (o.hasOwnProperty('draw')) {
				o.draw(Utils.floor_y, Utils.width, Utils.margin);
			}

			// Preview and Track
			if (typeof o.show === 'boolean') {
				Event.toggle(o, function () {
					if (Simulator.t > 0) {
						o.draw(Calc.data.Amax / Preview.step);
					}
				});
			}
		});
		Event.canvas.clear();

		// Attach mouse's events
		['mousedown', 'mousemove', 'mouseup']
		.forEach(function (eventName) {
			var callback;
			switch(eventName) {
				case 'mousedown':
					callback = function () {
						Simulator.t = 0;
						Simulator.reset();

						[Preview, Track].forEach(function (o) {
							o.canvas.clear();
						});
					};
					break;

				case 'mousemove':
					callback = function (x, y) {
						Preview.canvas.clear();
						if (Event.validate()) {
							Calc.data = Calc.prepare(
								Math.floor((x + y) / 4), // v0
								Math.atan(y / x), // angle
								Utils.g
							);
							
							// Draw launch preview
							Preview.draw(Calc.data.Amax / Preview.step);
						}
					};
					break;

				case 'mouseup':
					callback = Simulator.run;
					break;
			}
			Event.handle(eventName, callback);
		});

		// Adjust things when the screen change of sizes
		Event.resize(function () {
			if (Simulator.t > 0) Simulator.run(); else Simulator.reset();
		});
	},

	/**
	 * Reset the simulator to initial state
	 *
	 * @param {Object} sizes - (Optional) Launch's max height and width
	 **/
	reset: function (sizes) {
		Utils.update(Floor.y, sizes);
		Floor.draw(Utils.floor_y, Utils.width, Utils.margin);
		clearInterval(Simulator.interval);

		if (Simulator.t > 0) {
			Projectile.update(Calc.pos(Simulator.t), Utils.floor_y).draw();
		}
		else {
			Projectile.update({y: Utils.floor_y}).draw();
			window.scrollTo(0, Utils.height);
		}
	},

	/**
	 * Starts the launch animation
	 **/
	run: function () {
		Simulator.reset({width: Calc.data.Amax, height: Calc.data.Hmax});

		Track.t = 0;
		Track.canvas.clear();
		[Preview, Track].forEach(function (o) {
			o.draw(Calc.data.Amax / Preview.step);
		});

		Simulator.interval = setInterval(
			function () {
				Projectile.update(Calc.pos(Simulator.t), Utils.floor_y);
				if (Projectile.x >= Calc.data.Amax) {
					clearInterval(Simulator.interval);
				}
				else {
					Simulator.t += 0.05;
				}

				// Scroll the screen
				(function () {
					var y = Utils.height;

					// Pixels between the top window and th projectile
					if (Projectile.y < Utils.scroll.y) {
						y = Projectile.y - 100;
					}
					window.scrollTo(Projectile.x - Utils.scroll.x || 0, y);
				}());

				Projectile.draw();
				Track.draw();
			},
			Simulator.miliseconds
		);
	}
};
