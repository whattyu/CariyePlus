/* eslint-disable no-mixed-spaces-and-tabs */
const { EmbedBuilder } = require('discord.js');
const { Command, CommandType } = require('gcommands');
const OwnerOnlyInhbitor = require('../inhibitors/OwnerOnly.js');

new Command({
	name: 'serverlist',
	description: 'all servers only devs',
	type: [ CommandType.SLASH ],
	inhibitors: [
		new OwnerOnlyInhbitor(),
	],
	async run({ reply, client }) {
		const description =
    `Total Servers - ${client.guilds.cache.size}\n\n` +
    client.guilds.cache
    	.sort((a, b) => b.memberCount - a.memberCount)
    	.map(r => r)
    	.map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Members\nID - ${r.id}`)
    	.slice(0, 45)
    	.join('\n\n');

		const embed = new EmbedBuilder()
			.setAuthor({
				name: client.user.tag,
				iconURL: client.user.displayAvatarURL({ dynamic : true }),
			})
			.setColor('Random')
			.setDescription(description);

		return reply({ embeds: [embed] });
	},
});