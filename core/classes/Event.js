/**
 * Class Event
 *
 * Handle all events used by the simulator:
 * mousedown, mousemove, mouseup and window.resize
 **/
 var Event = {
	name: 'Event',
	data: {}, // Store interaction data
	// Indicate if a interaction is running
	began: false,

	/**
	 * Handle mouse events
	 *
	 * @see Simulator.js:92
	 * @param {String} eventName - Event's name triggered
	 * @param {String} callback
	 **/
	on: function (eventName, callback) {
		var self = this;
		switch (eventName) {
			case 'mousedown':
				$('#Public').on(eventName, function (event) {
					self.began = true;
					self.data = {
						x1: event.clientX,
						y1: event.clientY
					};

					callback();
				});
				break;

			case 'mousemove':
				$('#Public').on(eventName, function (event) {
					if (self.began) {
						$('.container').css('z-index', '2');
						self.data.x2 = event.clientX;
						self.data.y2 = event.clientY;						

						callback(
							self.data.x1 - self.data.x2, 
							self.data.y2 - self.data.y1
						);
					}
				});
				break;

			case 'mouseup':
				$('#Public').on(eventName, function () {
					self.began = false;
					$('.container').css('z-index', '4');
					if (self.validate()) { // @see Event.js:125
						callback();
					}
				});
				break;
		}
	},

	/**
	 * Control preview and track display
	 *
	 * @see Simulator.js:51
	 * @param {Object} o - Preview or Track object
	 * @param {Function} callback
	 **/
	toggle: function (o, callback) {
		$('#' + o.name.toLowerCase())
		.click(function () {
			o.t = 0;
			o.show = !o.show;
			$(this).toggleClass('active');
			o.canvas.clear();
			callback();
		});
	},

	/**
	 * Check whether a shape was drew from right top
	 * to left bottom (any size)
	 *
	 * @return {boolean}
	 **/
	validate: function () {
		return (this.data.y2 > this.data.y1
			&& this.data.x1 > this.data.x2);
	}
};
