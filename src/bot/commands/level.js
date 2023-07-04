/* eslint-disable no-shadow-restricted-names */
/* eslint-disable no-mixed-spaces-and-tabs */
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const Levels = require('discord-xp');
Levels.setURL(process.env.mongodb_uri);

new Command({
	name: 'level',
	description: 'Shows your current level!',
	type: [ CommandType.SLASH ],
	arguments: [
		new Argument({
			name: 'user',
			description: 'select an user if you want',
			type: ArgumentType.USER,
			required: false,
		}),
	],
	run: async ({ reply, guild, member, arguments }) => {
		const target = arguments.getMember('user') || member;
		const user = await Levels.fetch(target.id, guild.id);

		if (!user) {
			const u = new EmbedBuilder()
				.setColor('Random')
				.setTitle(`${target.user.username} Level`)
				.setThumbnail(target.displayAvatarURL() || '')
				.setDescription('oops , Seems like this user has not earned any xp so far.');

			return reply({
				embeds: [u],
			});
		}

		if (user) {
			const levelsss = new EmbedBuilder()
				.setColor('Random')
				.setTitle(`${target.user.username} Level`)
				.setThumbnail(target.displayAvatarURL() || '')
				.setDescription(`> **${target.user.username}** is currently level ${user.level}.`);

			return reply({
				embeds:	[levelsss],
			});
  	}
	},
});