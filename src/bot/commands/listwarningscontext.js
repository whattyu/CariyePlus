/* eslint-disable no-shadow-restricted-names */
const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const warnSchema = require('../models/warnSchema.js');

new Command({
	name: 'List Warnings',
	description: 'See members warnings',
	type: [ CommandType.CONTEXT_USER ],
	async run({ reply, arguments, guild, client }) {
		const a = arguments.getMember('user');

		const warnDoc = await warnSchema
			.findOne({
				guildID: guild.id,
				memberID: a.id,
			})
			.catch((err) => console.log(err));

		if (!warnDoc || !warnDoc.warnings.length) {
			return reply({
				content: `${a} has no warnings`,
				ephemeral: true,
			});
		}

		const data = [];

		for (let i = 0; warnDoc.warnings.length > i; i++) {
			data.push(`**ID:** ${i + 1}`);
			data.push(`**Reason:** ${warnDoc.warnings[i]}`);
			data.push(
				`**Moderator:** ${await client.users
					.fetch(warnDoc.moderator[i])
					.catch(() => 'Deleted User')}`,
			);
			data.push(
				`**Date:** ${'<t:' + warnDoc.date[i] + ':F>'}\n`,
			);
		}

		const embed = new EmbedBuilder()
			.setAuthor({
				name: a.user.username,
				iconURL: a.displayAvatarURL({ dynamic: false }),
			})
			.setColor('Random')
			.setDescription(data.join('\n'));

		return reply({
			embeds: [embed],
		});
	},
});