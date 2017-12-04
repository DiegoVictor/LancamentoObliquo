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
	 * Control preview and track display
	 *
	 * @see Simulator.js:47
	 * @param {Object} o - Preview or Track object
	 * @param {Function} callback
	 **/
	display: function (o, callback) {
		$('#'+o.name.toLowerCase()).click(function () {
			o.show = !o.show;
			o.t = 0;
			$(this).toggleClass('active');
			
			o.canvas.clear();
			callback();
		});
	},

	/**
	 * Handle mouse events
	 *
	 * @see Simulator.js:92
	 * @param {String} eventName - Event's name triggered
	 * @param {String} callback
	 **/
	handle: function (eventName, callback) {
		var self = this;
		switch (eventName) {
			case 'mousedown':
				$(self.canvas).on(eventName, function (event) {
					self.began = true;
					self.data = {
						x1: event.clientX,
						y1: event.clientY
					};

					callback();
				});
				break;

			case 'mousemove':
				$(self.canvas).on(eventName, function (event) {
					if (self.began) {
						self.shape(event); // @see Event.js:101
						$('.container').css('z-index', '2');

						self.data.x = self.data.x1 - self.data.x2;
						self.data.y = self.data.y2 - self.data.y1;

						callback(self.data.x, self.data.y);
					}
				});
				break;

			case 'mouseup':
				$(self.canvas).on(eventName, function () {
					self.canvas.clear();
					self.began = false;
					$('.container').css('z-index', '3');
					if (self.validate()) { // @see Event.js:125
						callback();
					}
				});
				break;
		}
	},

	/**
	 * Update Event's canvas sizes
	 *
	 * @see Simulator.js:96
	 * @param {Function} callback
	 **/
	resize: function (callback) {
		var self = this;
		$(window).resize(function () {
			callback();
			self.canvas.height = window.innerHeight;
			self.canvas.width = window.innerWidth;
			
		});
	},

	/**
	 * Draw a shape to show the launch angle
	 *
	 * @param {Object} event - JavaScript Event
	 **/
	shape: function (event) {
		this.canvas.clear();
		this.ctx.lineWidth = 2;

		this.ctx.moveTo(this.data.x1, this.data.y1);
		this.ctx.lineTo(event.clientX, event.clientY);
		this.ctx.strokeStyle = 'white';
		this.ctx.stroke();

		this.ctx.lineTo(this.data.x1, event.clientY);
		this.ctx.lineTo(this.data.x1, this.data.y1);
		this.ctx.setLineDash([5, 5]);
		this.ctx.stroke();

		this.data.x2 = event.clientX;
		this.data.y2 = event.clientY;
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
