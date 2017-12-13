/**
 * Object Track
 *
 * Draw the projectile' track path
 **/
 var Track = {
	name: 'Track',
	r: 0.5, // Track arcs' radius
	show: true, // Indicate if the track must be shown
	t: 0, // Time elapsed

	// Time (miliseconds) between every draw loop. See Helper->draw()
	step: 0.008
};
