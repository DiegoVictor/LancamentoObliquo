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
					case 'mousemove':
					case 'mouseup':
					}
				})());
			}, this.Workspace.canvas);
		}
	};

	App.bootstrap();
}());