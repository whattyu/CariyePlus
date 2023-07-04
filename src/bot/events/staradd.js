/* eslint-disable no-mixed-spaces-and-tabs */
const { Listener } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const starboardSchema = require('../models/stars.js');

new Listener({
	name: 'starAdd',
	event: 'messageReactionAdd',
	async run(reaction, user, client) {
		const handleStarboard = async () => {
    	starboardSchema.findOne({ Guild: reaction.message.guild.id }, async (err, data) => {
				if (!data) return;
				if (data.Channel === '0') return;

				const starboardchannel = data.Channel;
				const starboard = client.channels.cache.get(starboardchannel);
				const msgs = await starboard.messages.fetch({ limit: 100 });

				const existingMsg = msgs.find((msg) =>
					msg.embeds.length === 1
						? msg.embeds[0].footer.text.startsWith(reaction.message.id)
							? true
							: false

						: false,
				);

				if (existingMsg) {
					existingMsg.edit(
						`${reaction.count} - ⭐ | ${reaction.message.channel}`,
					);
				}
				else {
					const embed = new EmbedBuilder()
						.setAuthor(
							reaction.message.author.tag,
							reaction.message.author.displayAvatarURL(),
						)
						.setDescription(
							`**[Jump to this message](${reaction.message.url})**\n\n${reaction.message.content || ''} \n`,
						)
						.setFooter(reaction.message.id + ' - ' + new Date(reaction.message.createdTimestamp));

					if (reaction.message.attachments.array().length > 0) {
						embed.setImage(reaction.message.attachments.first().url);
					}

					if (starboard) starboard.send({ content: `1 - ⭐ | ${reaction.message.channel}`, embeds: [embed] });
				}
			});
  	};

	  if (reaction.emoji.name === 'star') {
    	starboardSchema.findOne({ Guild: reaction.message.guild.id }, async (err, data) => {
      	if (data == null) return;
      	const starboardchannel = data.Channel;
      	const starboard = client.channels.cache.get(starboardchannel);

      	if (reaction.message.channel.id == starboard.id) return;
      	if (reaction.message.partial) {
        	await reaction.fetch();
        	await reaction.message.fetch();
        	handleStarboard();
      	}
				else {handleStarboard();}
    	});
  	}

  	if (reaction.message.partial) await reaction.message.fetch();
  	if (reaction.partial) await reaction.fetch();

  	if (user.bot) return;
	},
});