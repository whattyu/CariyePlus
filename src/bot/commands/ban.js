/* eslint-disable no-shadow-restricted-names */
const { Command, CommandType, Argument, ArgumentType, Inhibitor: { MemberPermissions } } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
	name: 'ban',
	description: 'ban members',
	defaultMemberPermissions: ['BanMembers'],
	inhibitors: [
		new MemberPermissions({
			permissions: ['BanMembers'],
			message: 'You can\'t use this command!',
			ephemeral: true,
		}),
	],
	type: [ CommandType.SLASH ],
	arguments: [
		new Argument({
			name: 'user',
			description: 'Select user',
			type: ArgumentType.USER,
			required: true,
		}),
		new Argument({
			name: 'reason',
			description: 'provide a reason if u want',
			type: ArgumentType.STRING,
		}),
	],
	async run({ reply, arguments, guild, member, client }) {
		const a = arguments.getMember('user');
		const re = arguments.getString('reason');

		if (member.user.id === a.user.id) {
			return reply({
				content: 'You cannot ban **yourself**.',
				ephemeral: true,
			});
		}

		if (a.user.id === client.user.id) {
			return reply({
				content: 'I cannot ban **myself**',
				ephemeral: true,
			});
		}

		if (member.roles.highest.position <= a.roles.highest.position) {
			return reply({
				content: 'You cannot ban the person because you are trying to ban has **same** or **high** permission as yours.',
				ephemeral: true,
			});
		}

		if (a.bannable == false) {
			return reply({
				content: 'It is **not possible** to ban the person you are trying to ban.',
				ephemeral: true,
			});
		}

		guild.members.ban(a, { reason: `${re || 'No reason provided'}` });

		const embed = new EmbedBuilder()
			.setTitle(`${a.user.username} is Banned`)
			.setThumbnail('https://media.giphy.com/media/qPD4yGsrc0pdm/giphy.gif')
			.setDescription(`Reason: ${re || 'No reason provided'}`)
			.setColor('Random')
			.setTimestamp()
			.setFooter({ text: `Judge: ${member.user.username}`, iconURL: member.user.avatarURL() });

		return reply({
			embeds: [embed],
		});
	},
});