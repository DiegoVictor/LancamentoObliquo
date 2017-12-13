/**
 * Object Simulator
 *
 * Control the application workflow.
 **/
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
		[Projectile, Floor, Preview, Track, Public]
		.forEach(function (o) {
			var canvas = $('<canvas id="' + o.name + '"></canvas>').prependTo('body');

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
		Public.canvas.clear();

		$('.dropdown-toggle').on('mousedown', function () {
			$('.dropdown-container, .container').toggleClass('menu');
		});
		
		$('.fly').click(function () {
			var value, params = {ang: 0, v0: 0, g: 0};

			for (var data in params) {
				value = parseFloat($('#' + data).val());
				if (!isNaN(value)) {
					params[data] = value;
					continue;
				}
				return;
			}

			params.ang = params.ang / 180 * Math.PI;
			Calc.data = Calc.prepare(
				params.v0, params.ang, params.g
			);

			Simulator.t = 0;
			Simulator.run();
		});

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
						Public.canvas.clear();
						Public.ctx.lineWidth = 2;

						Public.ctx.moveTo(Event.data.x1, Event.data.y1);
						Public.ctx.lineTo(Event.data.x2, Event.data.y2);
						Public.ctx.strokeStyle = 'white';
						Public.ctx.stroke();

						Public.ctx.lineTo(Event.data.x1, Event.data.y2);
						Public.ctx.lineTo(Event.data.x1, Event.data.y1);
						Public.ctx.setLineDash([5, 5]);
						Public.ctx.stroke();

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
			Event.on(eventName, callback);
		});

		// Adjust things when the screen change of sizes
		$(window).resize(function () {
			Public.canvas.height = window.innerHeight;
			Public.canvas.width = window.innerWidth;

			if (Simulator.t > 0) {
				Simulator.run(); 
			}
			else {
				Simulator.reset();
			}			
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
		Public.canvas.clear();

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
		Utils.digest('g', Utils.g);
		['ang', 'v0', 'vx'].forEach(function (dataName) {
			Utils.digest(dataName, Calc.data[dataName]);
		});

		Simulator.reset(
			{width: Calc.data.Amax, height: Calc.data.Hmax}
		);

		Track.t = 0;
		Track.canvas.clear();
		[Preview, Track].forEach(function (o) {
			o.draw(Calc.data.Amax / Preview.step);
		});

		function print (data, x, y) {
			var string, size, i = 0;
			for (var key in data) {
				this.ctx.textAlign = 'center';
				string = key + ': ' + data[key].toFixed(2);
				size = this.ctx.measureText(string);
				this.ctx.fillStyle = "white";
				
				switch (key) {
					case 'x':
						x += this.x + this.r;
					case 'y':
					case 'vy':
						y = this.y - (15 * (++i));
						this.ctx.fillRect(
							(x - size.width / 2) - 2, y - 20,
							size.width + 4, 13
						);
						
						this.ctx.fillStyle = "#072a4b";
						this.ctx.fillText(string, x, y - 10);
						break;

					case 'hmax':
						this.ctx.setLineDash([5, 5]);
						this.ctx.lineWidth = 1;

						this.ctx.moveTo(0, y);
						this.ctx.lineTo(x, y);
						this.ctx.lineTo(x, Utils.floor_y);
						this.ctx.stroke();

						x = x / 2;
						this.ctx.fillRect(
							(x - size.width / 2) - 2, y - 20,
							size.width + 4, 13
						);

						this.ctx.fillStyle = "#072a4b";
						this.ctx.fillText(string, x, y - 10);
						break;
				}
			}
		}

		print.call(
			Floor,
			{'hmax': Calc.data.Hmax},
			(Calc.data.Amax / 2) + Utils.margin + Projectile.r,
			Utils.floor_y - Calc.data.Hmax - Projectile.r
		);

		function xyvy () {
			print.call(
				Projectile,
				{
					'x': Projectile.x,
					'y': Utils.floor_y - Projectile.y,
					'vy': Calc.data.vy - (Utils.g * Simulator.t)
				},
				Utils.margin,
			);
		}
		xyvy();

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
				xyvy();
			},
			Simulator.miliseconds
		);
	}
};
