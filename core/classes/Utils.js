/**
 * Object Utils
 *
 * Group many reusable functionalities and properties
 **/
 var Utils = {
	margin: 45, // Window left margin

	// Store what point the screen must start
	// the scroll, if necessary
	scroll: {},

	// Default gravity
	g: 9.78033,

	// Just to prevent few recalculations
	degree: 180 / Math.PI,

	// Update this class properties
	update: function (sizes, floor_y) {
		var size;

		this.height = window.innerHeight;
		this.width = window.innerWidth;

		this.useScroll = false;
		if (sizes) {
			this.scroll.x = this.width / 2 - 20;

			for (size in sizes) {
				if (sizes[size] > this[size] - 100) {
					this.useScroll = true;
					this[size] = sizes[size] + 175;
				}
			}
			this.scroll.y = this.height - 185;
		}

		this.floor_y = this.height - floor_y;
	}
};
