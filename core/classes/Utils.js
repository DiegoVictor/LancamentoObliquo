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

	/**
	 * Update his properties
	 *
	 * Check wheter is necessary scroll the page
	 * during the launchand set the scroll points
	 * when necessary
	 *
	 * @param {Number} y - Floor's height
	 * @param {Object} sizes - Launch's max height and width
	 **/
	update: function (y, sizes) {
		this.height = window.innerHeight;
		this.width = window.innerWidth;

		this.useScroll = false;
		if (typeof sizes === 'object') {
			this.scroll.x = this.width / 2 - 20;

			for (var size in sizes) {
				if (sizes[size] > this[size] - 150) {
					this.useScroll = true;
					this[size] = sizes[size] + 175;
				}
			}
			this.scroll.y = this.height - 185;
		}

		this.floor_y = this.height - y;
	}
};
