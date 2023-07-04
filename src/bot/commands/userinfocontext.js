/* eslint-disable no-shadow-restricted-names */
const { Command, CommandType } = require('gcommands');
const { EmbedBuilder, time } = require('discord.js');

new Command({
	name: 'User Info',
	description: 'user info',
	type: [CommandType.CONTEXT_USER],
	async run({ reply, arguments }) {
		const a = arguments.getMember('user');

		const e = new EmbedBuilder()
			.setAuthor({
				name: a.user.tag.toString(),
				iconURL: a.user.displayAvatarURL({ dynamic: true }),
			})
			.addFields([
				{ name: 'Username', value: a.user.username.toString(), inline: true },
				{ name: 'Discriminator', value: `#${a.user.discriminator.toString()}`, inline: true },
				{ name: 'Nickname', value: a.nickname || 'none', inline: true },
				{ name: 'Highest Role', value: a.roles.highest.toString(), inline: true },
				{ name: `Roles List [${a.roles.cache.size}]`, value: a.roles.cache.map(r => r).join(', '), inline: true },
				{ name: 'Flags', value: a.user?.flags?.toArray().toString() || 'no flags', inline: true },
				{ name: 'Timeout', value: a.user.isCommunicationDisabled ? a.user.communicationDisabledUntil : '❌', inline: true },
				{ name: 'Joined At', value: time(a.joinedAt, 'R') },
				{ name: 'Created At', value: time(a.user.createdAt, 'F') },
			])
			.setColor(a.displayHexColor || 'Random')
			.setThumbnail(a.user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 }))
			.setTimestamp();

		return reply({
			embeds: [e],
		});
	},
});