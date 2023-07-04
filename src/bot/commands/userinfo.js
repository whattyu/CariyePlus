/* eslint-disable no-shadow-restricted-names */
const { EmbedBuilder, time } = require('discord.js');
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');

new Command({
	name: 'userinfo',
	description: 'Check user informations',
	type: [ CommandType.SLASH ],
	arguments: [
		new Argument({
			name: 'user',
			description: 'Select user',
			type: ArgumentType.USER,
			required: false,
		}),
	],
	async run({ reply, arguments, member }) {
		const a = arguments.getMember('user') || member;

		const embed = new EmbedBuilder()
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
			embeds: [embed],
		});
	},
});