const { Listener } = require('gcommands');

new Listener({
	name: 'debug',
	event: 'debug',
	run(debug) {
		console.log(debug);
	},
});