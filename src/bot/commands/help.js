/* eslint-disable no-mixed-spaces-and-tabs */
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Command, CommandType, Commands } = require('gcommands');

new Command({
	name: 'help',
	description: 'need help use this',
	type: [ CommandType.SLASH ],
	async run({ reply }) {
		const e = new EmbedBuilder()
			.setTitle('All commands are in here')
			.setColor('Random')
			.setDescription(Commands.map(cmd => `\`${cmd.name}\`` + ': ' + cmd.description + ' (' + cmd.type + ')').join('\n'))
			.setFooter({
				text: '1: Slash | 2: Context Menu (User) | 3: Context Menu (Message)',
			});

		const row = new ActionRowBuilder().addComponents([
    	new ButtonBuilder()
      	.setLabel('Support Server / Our Community')
				.setURL('https://discord.gg/J4wDA93rjd')
				.setStyle(ButtonStyle.Link),

			new ButtonBuilder()
      	.setLabel('Support Me by Donation')
				.setURL('treon.com/cariyeplus/membership')
				.setStyle(ButtonStyle.Link),
		]);

		return reply({
			content: 'if u see a bug, text me \' whattyu#8272 \'',
			components: [row],
			ephemeral: true,
			embeds: [e],
		});
	},
});