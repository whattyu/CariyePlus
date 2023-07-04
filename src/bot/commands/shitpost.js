const { Command, CommandType } = require('gcommands');
const { AttachmentBuilder } = require('discord.js');
const fetch = require('node-fetch');

new Command({
	name: 'shitpost',
	description: 'sends a shitpost',
	type: [CommandType.SLASH],
	run: async ({ reply }) => {
		const json = await fetch('https://api.thedailyshitpost.net/random').then((res) => res.json());
		const file = new AttachmentBuilder(json.url);

		return reply({
			files: [file],
		});
	},
});