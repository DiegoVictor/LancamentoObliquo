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
		},
		bootstrap: function () {
		}
	};

	App.bootstrap();
}());