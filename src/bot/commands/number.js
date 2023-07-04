/* eslint-disable no-shadow-restricted-names */
const fetch = require('node-superfetch');
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
	name: 'number',
	description: 'Get a random fact about a number',
	arguments: [
		new Argument({
			name: 'number',
			description: 'the number',
			type: ArgumentType.INTEGER,
			required: true,
		}),
	],
	type: [CommandType.SLASH],
	run: async ({ reply, arguments }) => {
		const number = arguments.getInteger('number');

		const { body } = await fetch
			.get(`http://numbersapi.com/${number}`)
			.catch(() => {
				return reply({ content: 'I could not find any information about that number.', ephemeral: true });
			});
		if (!body) return;

		const em = new EmbedBuilder()
			.setTitle(body.toString())
			.setColor('Random');
		return reply({ embeds: [em] });
	},
});