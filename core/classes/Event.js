/**
 * Class Event
 *
 * Handle all events used by the simulator:
 * mousedown, mousemove, mouseup and window.resize
 **/
 var Event = {
	name: 'Event',
	began: false, // Indicate if a interaction is running

	},

	// Store interaction data
	data: {},
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



			this.data.validated = false;
			if (event.clientY > this.data.y1
				&& this.data.x1 > event.clientX) {
				this.data.validated = true;

			}

			this.data.x2 = event.clientX;
			this.data.y2 = event.clientY;
		}
	},

	}
};
