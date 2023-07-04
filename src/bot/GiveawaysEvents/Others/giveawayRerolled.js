const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'giveawayRerolled',
	execute(giveaway, winners) {
		winners.forEach((winner) => {
			const e = new EmbedBuilder()
				.setColor('Random')
				.setTitle('🎁 Congratulations!')
				.setDescription(`Congratulations, you won the [Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})!\nYour prize is: \`${giveaway.prize}\``);
			// eslint-disable-next-line no-empty-function
			return winner.send({ embeds: [e] }).catch(() => {});
		});
	},
};