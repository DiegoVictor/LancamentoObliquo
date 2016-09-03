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
			update: function () {
				this.height = window.innerHeight;
				this.width = window.innerWidth;
				this.max = {
					x: this.width - 100,
					y: this.height - 50
				};
			},
		},

		Floor: {
			scale: 200,
			unit: 200,
			y: window.innerHeight - 35,
			width: window.innerWidth,
		},

		Preview: {
			show: false,
			r: 0.5,
		},

		Track: {
			show: false,
			r: 0.5,
		},

		Workspace: {
			x: 0,
			r: 4,
		},

		bootstrap: function () {
			this.Utils.update();
			this.Workspace.y = this.Floor.y;
			this.status = 'stoped';

		}
	};

	App.bootstrap();
}());