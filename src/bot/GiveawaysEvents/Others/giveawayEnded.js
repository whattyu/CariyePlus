const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'giveawayEnded',
	execute(giveaway, winners) {
		winners.forEach((winner) => {
			const a = new EmbedBuilder()
				.setColor('Random')
				.setTitle('🎁 Congratulations!')
				.setDescription(`Congratulations, you won the [Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})!\nYour prize is: \`${giveaway.prize}\``);

			// eslint-disable-next-line no-empty-function
			return winner.send({ embeds: [a] }).catch(() => {});
		});
	},
};