/* eslint-disable no-shadow-restricted-names */
/* eslint-disable no-mixed-spaces-and-tabs */
const { Command, CommandType, Inhibitor: { MemberPermissions } } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
	name: 'Kick Member',
	description: 'kick members',
	defaultMemberPermissions: ['KickMembers'],
	type: [ CommandType.CONTEXT_USER ],
	inhibitors: [
		new MemberPermissions({
			permissions: ['KickMembers'],
			message: 'You can\'t use this command!',
			ephemeral: true,
		}),
	],
	run({ reply, arguments, guild, member, client }) {
		try {
			const a = arguments.getMember('user');

			if (member.user.id === a.user.id) {
				return reply({
					content: 'You cannot kick **yourself**.',
					ephemeral: true,
				});
			}

			if (a.user.id === client.user.id) {
				return reply({
      	content: 'I can\'t kick **myself**',
      	ephemeral: true,
    	});
			}

			if (member.roles.highest.position <= a.roles.highest.position) {
				return reply({
					content: 'You cannot kick the person because you are trying to kick has **same** or **high** authority as yours.',
					ephemeral: true,
				});
			}

			guild.members.kick(a, { reason: 'No reason provided - Context Menu' });

			const embed = new EmbedBuilder()
				.setTitle(`${a.user.username} is Kicked`)
				.setThumbnail('https://media.giphy.com/media/l3V0j3ytFyGHqiV7W/giphy.gif')
				.setColor('Random')
				.setTimestamp()
				.setFooter({
					text: `Judge: ${member.user.username}`,
					iconURL: member.user.avatarURL(),
				});

			return reply({
				embeds: [embed],
			});
		}
		catch (error) {
			console.log(error);
			return reply({
				content: 'An error occurred',
				ephemeral: true,
			});
		}
	},
});