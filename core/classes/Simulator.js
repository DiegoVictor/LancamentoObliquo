var Simulator = {
	interval: null, // Store the loop

	// Time between every loop's iterations (miliseconds)
	miliseconds: 30,
	t: 0, // Launch time elapsed

	init: function () {
		Utils.update(false, Floor.y);
		Helper.arc = function () {
			this.ctx.beginPath();
			this.ctx.arc(
				this.x + Utils.margin + Projectile.r,
				this.y - Projectile.r, this.r, -0.01, Math.PI * 2
			);
			this.ctx.strokeStyle = 'white';
			this.ctx.stroke();
		};

		Projectile.y = Utils.floor_y;
		[Floor, Projectile, Preview, Track, Event, Calc]
		.forEach(function (workspace) {
			var canvas = $('<canvas id="'+workspace.name+'"></canvas>').prependTo('body');

			if (!isNaN(workspace.r)) {
				workspace.__proto__ = Helper;
			}

			workspace.canvas = canvas.get(0);
			workspace.ctx = workspace.canvas.getContext('2d');
			if (workspace.hasOwnProperty('draw')) {
				workspace.draw(Utils);
			}

			if (typeof workspace.show === 'boolean') {
				// Control preview and track display
				$('#'+workspace.name.toLowerCase()).click(function () {
					$(this).toggleClass('active');
					workspace.show = !workspace.show;
					if (workspace.t !== undefined) {
						workspace.t = 0;
					}

					workspace.canvas.clear();
					if (Calc.data) {
						workspace.draw(Calc, Utils.floor_y, Simulator.t);
					}
				});
			}
		});
		Event.canvas.clear();

		// Prepare Floor and Preview before launch
		function adjust () {
			if (Utils.useScroll) {
				Floor.draw(Utils);
				Track.canvas.clear();
				Preview.draw(Calc, Utils.floor_y);
				window.scrollTo(0, Utils.height);
			}
		}

		// Attach mouse's events
		$(Event.canvas).on(
			'mousedown mousemove mouseup',
			function (event) {
				Event.handler(event); // Process the event

				switch (event.type) {
					case 'mousedown':
						Simulator.reset();
						break;

					case 'mousemove':
						if (Event.began) {
							$('.container').css('z-index', '2');

							// Make some calculations
							Calc.data = (function (x, y) {
								return Calc.prepare(
									Math.floor((x + y) / 4), // v0
									Math.atan(y / x), // angle
									Utils.g
								);
							})(Event.data.x, Event.data.y);

							Preview.canvas.clear();
							if (Event.data.validated) {
								// Draw launch preview
								Preview.draw(Calc, Utils.floor_y);
							}
						}
						break;

					case 'mouseup':
						$('.container').css('z-index', '3');
						if (Event.data.validated) {
							Simulator.run(adjust);
						}
						else {
							Event.data.validated = false;
						}
						break;
				}
			}
		);

		// Adjust things when the screen change of sizes
		$(window).resize(function () {
			var position;

			clearInterval(Simulator.interval);
			if (Simulator.t > 0) {
				position = Calc.pos(Simulator.t, Utils.floor_y);

				Track.t = 0;
				Simulator.run(function () {
					Projectile.update(position);
					Floor.draw(Utils);
					[Preview, Track, Projectile]
					.forEach(function (workspace) {
						workspace.draw(Calc, Utils.floor_y, Simulator.t);
					});
				});
			}
			else {
				Utils.update(false, Floor.y);
				Projectile.reset(Utils.floor_y);
				Floor.draw(Utils);
			}

			Event.canvas.height = window.innerHeight;
			Event.canvas.width = window.innerWidth;
		});

		// Run manually
		// $('#run').click(function () {
		// 	var data = {g: Utils.g, ang: 45 / Utils.degree, v0: 100};
		//
		// 	Simulator.reset();
		// 	['g', 'ang', 'v0'].forEach(function(dataName) {
		// 		var value = $('#'+dataName).val();
		//
		// 		if (!isNaN(parseFloat(value))) {
		// 			if (dataName === 'ang') {
		// 				value = value / Utils.degree;
		// 			}
		// 			data[dataName] = value;
		// 		}
		// 	});
		//
		// 	Calc.data = Calc.prepare(data.v0, data.ang, data.g);
		// 	Preview.draw(Calc, Utils.floor_y);
		// 	Simulator.run(adjust);
		// });
	},

	// Reset the simulator to initial state
	reset: function () {
		Utils.update(false, Floor.y);
		clearInterval(this.interval);
		window.scrollTo(0, Utils.height);

		[Simulator, Preview, Track, Calc].forEach(function (Layer) {
			if (typeof Layer.t === 'number') {
				Layer.t = 0;
			}

			if (typeof Layer.canvas !== 'undefined') {
				Layer.canvas.clear();
			}
		});

		Floor.draw(Utils);
		Projectile.reset(Utils.floor_y);
	},

	// Launch the projectile
	run: function (callback) {
		Utils.update({width: Calc.data.Amax, height: Calc.data.Hmax}, Floor.y);
		callback();

		// Show data on interface (inputs)
		['g', 'ang', 'v0'].forEach(function (dataName) {
			var input = $('#'+dataName);
			input.val(Calc.data[dataName]).trigger('keyup');
		});

		// Show Hmax
		Calc.show('hmax', function (callback) {
			callback.call(Floor, Projectile, Utils);
		});

		this.interval = setInterval(
			function () {
				Projectile.update(Calc.pos(Simulator.t, Utils.floor_y));
				if (Projectile.x >= Calc.data.Amax) {
					clearInterval(Simulator.interval);
				}
				else {
					Simulator.t += 0.05;
				}

				// Scroll the screen
				(function (mustScrollY) {
					var y = Utils.height;

					// Pixels between the top window and th projectile
					if (mustScrollY) {
						y = Projectile.y - 100;
					}
					window.scrollTo(Projectile.x - Utils.scroll.x || 0, y);
				}(Projectile.y < Utils.scroll.y));

				Projectile.draw();
				Calc.show('position', function (callback) {
					callback(Projectile, Utils);
				});
				Track.draw(Calc, Utils.floor_y, Simulator.t);
				Calc.show('velocity', function (callback) {
					callback.call(Event, Utils, Floor.y, Simulator.t);
				});
			},
			Simulator.miliseconds
		);
	}
};
