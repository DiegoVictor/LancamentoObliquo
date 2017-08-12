/**
 * Class Event
 *
 * Handle all events used by the simulator:
 * mousedown, mousemove, mouseup and window.resize
 **/
 var Event = {
	name: 'Event',
	began: false, // Indicate if a interaction is running

	// Configure events' handlers
	callbacks: {
		begin: ['mousedown'], update: ['mousemove'], stop: ['mouseup']
	},

	// Store interaction data
	data: {},

	// Call respective event's handler callback
	handler: function (event) {
		var callback, callbacks = this.callbacks;
		for (callback in callbacks) {
			if (callbacks[callback].indexOf(event.type) !== -1) {
				this[callback](event);
				break;
			}
		}
	},

	begin: function (event) {
		this.began = true;

		this.data = {
			x1: event.clientX,
			y1: event.clientY
		};
	},

	update: function (event) {
		if (this.began) {
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

			this.data.validated = false;
			if (event.clientY > this.data.y1
				&& this.data.x1 > event.clientX) {
				this.data.validated = true;

				this.data.x = this.data.x1 - event.clientX;
				this.data.y = event.clientY - this.data.y1;
			}

			this.data.x2 = event.clientX;
			this.data.y2 = event.clientY;
		}
	},

	stop: function () {
		this.canvas.clear();
		this.began = false;
	}
};
