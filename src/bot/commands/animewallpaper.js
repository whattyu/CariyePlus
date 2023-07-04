const { EmbedBuilder } = require('discord.js');
const { Command, CommandType } = require('gcommands');

new Command({
	name: 'animewallpaper',
	description: 'random anime wallpapers',
	type: [CommandType.SLASH],
	run: async ({ reply }) => {
		const embed = new EmbedBuilder()
			.setColor('Random')
			.setImage('https://pic.re/images')
			.setTitle('Anime Wallpapers');

		return reply({
			embeds: [embed],
		});
	},
});