'use strict';

(function () {
	var App = {
		Utils: {
			g: 9.78033,
			margin: 30,
			Layers: ['Floor', 'Preview', 'Track', 'Workspace'],

			config: function (canvas) {
				canvas.height = this.height;
				canvas.width = this.width;
			},

			Canvas: function (Layer) {
				var canvas = document.createElement('canvas');
				canvas.setAttribute('id', Layer);
				this.config(canvas);

				document.body.appendChild(canvas);
				return canvas;
			},

			arc: function () {
				this.ctx.beginPath();
				this.ctx.arc(
					this.x + this.Utils.margin, this.y - this.r,
					this.r, 0, Math.PI * 2);
				this.Utils.style.call(this, 1);
				this.ctx.stroke();
			},

			draw: function (step, limit) {
				if (this.show) {
					if (typeof limit === 'undefined') {
						this.t = 0;
						this.Utils.config(this.canvas);
					}

					do {
						this.x = App.Launchment.vx * this.t;

						this.y = App.Launchment.vy * this.t;
						this.y -= this.Utils.g * Math.pow(this.t, 2) / 2;

						if (this.y > 4 || typeof limit === 'number') {
							this.y = App.Floor.y - App.Workspace.r - this.y;
							this.Utils.arc.call(this);
						}

						this.t += step || 0.1;
						if (typeof limit !== 'undefined' && this.t >= limit) {
							break;
						}
					} while (this.x < App.Launchment.Amax);
				}
			},

			update: function () {
				this.height = window.innerHeight;
				this.width = window.innerWidth;
				this.max = {
					x: this.width - 100,
					y: this.height - 50
				};

				App.Launchment.max = {
					x: this.width / 2, y: this.height - 185
				};
			},

			expand: function () {
				this.Utils.update();
				if (this.Hmax > this.Utils.max.y) {
					this.Utils.height = this.Hmax + 200;
				}
				if (this.Amax > this.Utils.max.x) {
					this.Utils.width = this.Amax + 150;
				}
				return this.Utils;
			},

			style: function (width) {
				this.ctx.lineWidth = width || 2;
				this.ctx.strokeStyle = 'white';
			},

			digest: function (Model) {
				var value = App;

				Model.split('.').forEach(function (variableName) {
					value = value[variableName];
				});
				document.getElementById(Model).value = value;
			},

			launch: function () {
				this.expand.call(App.Launchment);
				this.config(App.Track.canvas);

				App.Floor.reset();
				App.Preview.draw();
				App.Workspace.reset();
				window.scrollTo(0, this.height);

				['ang', 'v0', 'vx', 'Amax', 'Hmax'].forEach(function (prop) {
					this.digest('Launchment.' + prop);
				}, this);

				App.status = 'launching';
				App.Launchment.interval = setInterval(function () {
					App.Launchment.update();
				}, App.Launchment.miliseconds);
			}
		},

		Floor: {
			scale: 200,
			unit: 200,
			y: window.innerHeight - 35,
			width: window.innerWidth,

			draw: function () {
				this.ctx.moveTo(0, this.y);
				this.ctx.lineTo(this.width, this.y);

				this.Utils.style.call(this);
				this.ctx.stroke();

				this.ctx.font = "14px Calibri, sans-serif";
				this.ctx.fillStyle = 'white';
				for (var i = 0; i < this.width / this.scale; i++) {
					this.ctx.fillText(
						i * this.unit, 30 + i * this.scale, this.y + 15);
				}
			},

			reset: function () {
				this.y = this.Utils.height - 35;
				this.width = this.Utils.width;
				this.Utils.config(this.canvas);
				this.draw();
			}
		},

		Preview: {
			show: false,
			r: 0.5,

			draw: function () {
				this.Utils.draw.call(this);
			}
		},

		Track: {
			show: false,
			r: 0.5,

			draw: function (limit) {
				this.Utils.draw.call(this, 0.01, limit);
			}
		},

		Workspace: {
			x: 0,
			r: 4,

			draw: function () {
				this.Utils.config(this.canvas);
				this.Utils.arc.call(this);
			},

			reset: function () {
				this.x = 0;
				this.y = App.Floor.y;
				this.draw();
			}
		},

		Launchment: {
			miliseconds: 60,
			interval: null,
			t: 0,

			update: function () {
				this.x = this.vx * this.t;
				if (this.x > this.Amax) {
					App.status = 'stoped';
					this.x = this.Amax;
					clearInterval(this.interval);
				}

				this.scroll = {x: 0, y: this.Utils.height};
				if (this.x > this.max.x) {
					this.scroll.x = this.x - this.max.x;
				}

				this.y = this.vy * this.t;
				this.y -= this.Utils.g * Math.pow(this.t, 2) / 2;
				if (this.y > this.max.y) {
					this.scroll.y -= (this.y + 150);
				}
				window.scrollTo(this.scroll.x, this.scroll.y);

				if (this.y < 0) {
					this.y = 0;
				}

				App.Workspace.x = this.x;
				App.Workspace.y = App.Floor.y - this.y;
				App.Workspace.draw();

				this.vvy = this.vy - (this.Utils.g * this.t);
				['vvy', 'x', 'y'].forEach(function (prop) {
					this.digest('Launchment.' + prop);
				}, this.Utils);

				App.Track.draw(this.t);
				this.t += 0.05;
			},

			prepare: function () {
				var deg;

				function toDegree (rad) {
					return (rad / 180) * Math.PI;
				};

				if (App.status !== 'manually') {
					this.x = App.Mouse.x1 - App.Mouse.x2;
					this.y = App.Mouse.y2 - App.Mouse.y1;
					this.v0 = Math.floor((this.x + this.y) / 4);
					this.ang = Math.atan(this.y / this.x) * 180 / Math.PI;
				}

				deg = toDegree(this.ang);
				this.vy = this.v0 * Math.sin(deg);
				this.vx = this.v0 * Math.cos(deg);

				this.Amax = Math.sin(toDegree(2 * this.ang));
				this.Amax *= Math.pow(this.v0, 2);
				this.Amax /= this.Utils.g;

				this.Hmax = Math.pow(this.vy, 2);
				this.Hmax *= 1 / this.Utils.g - 1 / (2 * this.Utils.g);
			}
		},

		reset: function () {
			clearInterval(this.Launchment.interval);
			this.Utils.update();

			this.Utils.Layers.forEach(function (Layer) {
				this.Utils.config(this[Layer].canvas);

				if (typeof this[Layer].reset === 'function') {
					this[Layer].reset();
				}
			}, this);
		},

		bootstrap: function () {
			this.Utils.update();
			this.Workspace.y = this.Floor.y;
			this.status = 'stoped';

			this.Utils.Layers.forEach(function (Layer) {
				this[Layer].canvas = this.Utils.Canvas(Layer);
				this[Layer].ctx = this[Layer].canvas.getContext('2d');

				this[Layer].Utils = this.Utils;
				this[Layer].draw();
			}, this);

			this.Launchment.Utils = this.Utils;

			window.onresize = function () {
				App.Utils.expand.call(App.Launchment)
				.Layers.forEach(function (Layer) {
					this.Utils.config(this[Layer].canvas);
				}, App);
				App.Floor.reset();

				App.Preview.draw();
				if (App.Launchment.t > 0) {
					App.Track.t = 0;
					App.Track.draw(App.Launchment.t);
				}

				if (App.status === 'stoped') {
					App.Workspace.y = App.Floor.y;
					App.Workspace.draw();

					if (App.Launchment.t > 0) {
						window.scrollTo(App.Utils.width, App.Utils.height);
					}
				}
			};
			['mousedown', 'mousemove', 'mouseup'].forEach(function (event) {
				this.addEventListener(event, (function () {
					switch (event) {
					case 'mousedown':
						return function (e) {
							App.reset();
							App.status = 'preparing';
							App.Launchment.t = App.Track.t = 0;
							App.Mouse = {x1: e.clientX, y1: e.clientY};

							App.Utils.digest('Utils.g');
							window.scrollTo(0, 0);
						};

					case 'mousemove':
						return function (e) {
							if (App.status !== 'preparing') {
								return ;
							}

							App.Workspace.draw();

							App.Mouse.x2 = e.clientX;
							App.Mouse.y2 = e.clientY;

							App.Launchment.prepare();
							if (e.clientY > App.Mouse.y1
								&& App.Mouse.x1 > e.clientX) {
								App.Preview.draw();
							}
							else {
								App.Utils.config(App.Preview.canvas);
							}

							App.Workspace.ctx.beginPath();
							App.Utils.style.call(App.Workspace);
							App.Workspace.ctx.moveTo(App.Mouse.x1, App.Mouse.y1);
							App.Workspace.ctx.lineTo(e.clientX, e.clientY);
							App.Workspace.ctx.stroke();

							App.Workspace.ctx.lineTo(App.Mouse.x1, e.clientY);
							App.Workspace.ctx.lineTo(App.Mouse.x1, App.Mouse.y1);

							App.Workspace.ctx.setLineDash([5, 5]);
							App.Workspace.ctx.stroke();
						};

					case 'mouseup':
						return function (e) {
							if (App.status === 'preparing') {
								if (e.clientY > App.Mouse.y1 && App.Mouse.x1 > e.clientX) {
									App.Utils.launch();
								}
								else {
									App.Workspace.reset();
									App.status = 'stoped';
								}
							}
						};
					}
				})());
			}, this.Workspace.canvas);
		}
	};

	App.bootstrap();
}());