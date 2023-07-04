/* eslint-disable no-shadow-restricted-names */
const { EmbedBuilder } = require('discord.js');
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');

new Command({
	name: 'avatar',
	description: 'gets avatar',
	type: [ CommandType.SLASH ],
	arguments: [
		new Argument({
			name: 'tag',
			description: 'tag whose avatar you want to know',
			type: ArgumentType.USER,
			required: false,
		}),
	],
	async run({ reply, arguments, member }) {
		const y = arguments.getMember('tag') || member;

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