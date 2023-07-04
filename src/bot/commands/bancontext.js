/* eslint-disable no-shadow-restricted-names */
const { Command, CommandType, Inhibitor: { MemberPermissions } } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
	name: 'Ban Member',
	description: 'ban members',
	defaultMemberPermissions: ['BanMembers'],
	inhibitors: [
		new MemberPermissions({
			permissions: ['BanMembers'],
			message: 'You can\'t use this command!',
			ephemeral: true,
		}),
	],
	type: [ CommandType.CONTEXT_USER ],
	async run({ reply, arguments, guild, member, client }) {
		const a = arguments.getMember('user');

		if (a.user.id === client.user.id) {
			return reply({
				content: 'I can\'t ban **myself**',
				ephemeral: true,
			});
		}

		if (member.roles.highest.position <= a.roles.highest.position) {
			return reply({
				content: 'You cannot ban the person because you are trying to ban has **same** or **high** authority as yours.',
				ephemeral: true,
			});
		}

		if (member.user.id === a.user.id) {
			return reply({
				content: 'You cannot ban **yourself**.',
				ephemeral: true,
			});
		}

		if (member.roles.highest.position <= a.roles.highest.position) {
			return reply({
				content: 'You cannot ban the person because you are trying to ban has **same** or **high** authority as yours.',
				ephemeral: true,
			});
		}

		if (a.bannable == false) {
			return reply({
				content: 'It is **not possible** to ban the person you are trying to ban.',
				ephemeral: true,
			});
		}

		guild.members.ban(a, { reason: 'No reason provided - Context Menu' });

		const embed = new EmbedBuilder()
			.setTitle(`${a.user.username} is Banned`)
			.setThumbnail('https://media.giphy.com/media/qPD4yGsrc0pdm/giphy.gif')
			.setColor('Random')
			.setTimestamp()
			.setFooter({ text: `Judge: ${member.user.username}`, iconURL: member.user.avatarURL() });

		return reply({
			embeds: [embed],
		});
	},
});