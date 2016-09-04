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

			update: function () {
				this.height = window.innerHeight;
				this.width = window.innerWidth;
				this.max = {
					x: this.width - 100,
					y: this.height - 50
				};
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
		},

		Preview: {
			show: false,
			r: 0.5,

			draw: function () {
			}
		},

		Track: {
			show: false,
			r: 0.5,

			draw: function (limit) {
			}
		},

		Workspace: {
			x: 0,
			r: 4,

			draw: function () {
				this.Utils.config(this.canvas);
				this.Utils.arc.call(this);
			},
		},

		Launchment: {
			miliseconds: 60,
			interval: null,
			t: 0,
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
		}
	};

	App.bootstrap();
}());