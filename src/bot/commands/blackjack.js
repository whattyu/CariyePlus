const blackjack = require('../structures/blackjack/bindex');
const { Command, CommandType } = require('gcommands');

new Command({
	name: 'blackjack',
	description: 'blackjack game',
	type: [CommandType.SLASH],
	async run({ interaction }) {
		blackjack(interaction);
	},
});