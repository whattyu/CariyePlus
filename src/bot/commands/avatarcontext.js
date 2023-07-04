/* eslint-disable no-shadow-restricted-names */
const { EmbedBuilder } = require('discord.js');
const { Command, CommandType } = require('gcommands');

new Command({
	name: 'Avatar',
	description: 'gets avatar',
	type: [ CommandType.CONTEXT_USER ],
	async run({ reply, arguments }) {
		const y = arguments.getMember('user');

		const e = new EmbedBuilder()
			.setTitle(`${y.user.username}'s Avatar`)
			.setURL(y.user.avatarURL({ dynamic: true, size: 4096, format: 'png' }))
			.setColor('Random')
			.setImage(y.user.avatarURL({ dynamic: true, size: 4096, format: 'png' }));

		return reply({
			embeds: [e],
		});
	},
});