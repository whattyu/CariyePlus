const { Listener } = require('gcommands');
const starboardSchema = require('../models/stars.js');

new Listener({
	name: 'starRemove',
	event: 'messageReactionRemove',
	async run(reaction, user, client) {
		const handleStarboard = async () => {
			starboardSchema.findOne({ Guild: reaction.message.guild.id }, async (err, data) => {
				if (!data) return;
				if (data.Channel === '0') return;

				const starboardchannel = data.Channel;
				const starboard = client.channels.cache.get(starboardchannel);
				const msgs = await starboard.messages.fetch({ limit: 100 });

				// console.log(msgs);
				const existingMsg = msgs.find((msg) =>
					msg.embeds.length === 1
						? msg.embeds[0].footer.text.startsWith(reaction.message.id)
							? true
							: false
						: false,
				);

				if (existingMsg) {
					if (reaction.count === 0) existingMsg.delete({ timeout: 2500 });
					else existingMsg.edit(`${reaction.count} - | ${reaction.message.channel}`);
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
				else { handleStarboard(); }
			});
		}

		if (reaction.message.partial) await reaction.message.fetch();
		if (reaction.partial) await reaction.fetch();
		if (user.bot) return;
	},
});