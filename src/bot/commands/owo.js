const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { Command, CommandType } = require('gcommands');

new Command({
	name: 'owo',
	description: 'OwO',
	type: [CommandType.SLASH],
	run: async ({ reply }) => {
		const data = await fetch('https://rra.ram.moe/i/r?type=owo').then(res =>
			res.json(),
		);
		const url = `https://cdn.ram.moe/${data.path.replace('/i/', '')}`;
		const embed = new EmbedBuilder()
			.setColor('Random')
			.setDescription(`[Click here if the image failed to load.](${url})`)
			.setImage(url)
			.setTimestamp();
		return reply({
			embeds: [embed],
		});
	},
});