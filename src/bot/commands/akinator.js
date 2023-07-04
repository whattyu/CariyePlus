const { Command, CommandType } = require('gcommands');
const akinator = require('../structures/akinator.js');

new Command({
	name: 'akinator',
	description: 'Starts a game of Akinator',
	nameLocalizations: {
		'tr': 'akinator',
	},
	descriptionLocalizations: {
		'tr': 'Akinator oyununu',
	},
	type: [ CommandType.SLASH ],
	async run({ interaction }) {
		interaction.reply({ content: 'Attempted to start a game of Akinator.', ephemeral: true });
		akinator(interaction);
	},
});