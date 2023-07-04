/* eslint-disable no-shadow-restricted-names */
/* eslint-disable no-mixed-spaces-and-tabs */
const { Command, CommandType, Argument, ArgumentType, Inhibitor: { MemberPermissions } } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const warnSchema = require('../models/warnSchema.js');

new Command({
	name: 'warn',
	description: 'warn members',
	defaultMemberPermissions: ['ModerateMembers'],
	inhibitors: [
		new MemberPermissions({
			permissions: ['BanMembers', 'Administrator'],
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
	async run({ reply, arguments, guild, member, interaction }) {
		const a = arguments.getMember('user');
		const re = arguments.getString('reason') || 'No reason provided';

		if (member.user.id === a.user.id) {
			return reply({
				content: 'You cannot warn **yourself**.',
				ephemeral: true,
			});
		}

		if (member.roles.highest.position <= a.roles.highest.position) {
			return reply({
				content: 'You cannot warn the person because you are trying to warn has **same** or **high** authority as yours.',
				ephemeral: true,
			});
		}

		let warnDoc = await warnSchema
			.findOne({
				guildID: guild.id,
				memberID: a.id,
			})
			.catch((err) => console.log(err));

		if (!warnDoc) {
			warnDoc = new warnSchema({
				guildID: guild.id,
				memberID: a.id,
				warnings: [re],
				moderator: [member.id],
				date: [Math.round(interaction.createdTimestamp / 1000)],
			});

			await warnDoc.save().catch((err) => console.log(err));
			return reply({ content: `**Successfully Warned ${a}**` });
		}
		else {
			if (warnDoc.warnings.length >= 3) {
				return reply({
					content: 'This member has already been warned 3 times, use ban command to ban this user from this guild or use unwarn to remove the warnings from this user',
					ephemeral: true,
				});
			}

			warnDoc.warnings.push(re);
			warnDoc.moderator.push(member.id);
			warnDoc.date.push(Math.round(interaction.createdTimestamp / 1000));

			await warnDoc.save().catch((err) => console.log(err));

			const embed = new EmbedBuilder()
				.setDescription(`Warned **${a}** \n Reason: **${re}**`)
				.setColor('Random')
			  .setFooter({
					text: `Judge: ${member.user.username}`,
				});

			return reply({
				embeds: [embed],
			});
		}
	},
});