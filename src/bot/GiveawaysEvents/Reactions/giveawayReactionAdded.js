/* eslint-disable no-mixed-spaces-and-tabs */
const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'giveawayReactionAdded',
	execute(giveaway, member) {
  	return member.send({
			embeds: [
				new EmbedBuilder()
					.setColor('Random')
					.setTitle('👏 Good job!')
        	.setDescription(`Great, you entered the [Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})!\nGiveaway prize: \`${giveaway.prize}\`\nGood luck!`),
			],
		// eslint-disable-next-line no-empty-function
		}).catch(() => {});
	},
};