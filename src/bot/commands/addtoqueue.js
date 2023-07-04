/* eslint-disable no-shadow-restricted-names */
/* eslint-disable no-constant-condition */
/* eslint-disable no-cond-assign */
/* eslint-disable no-mixed-spaces-and-tabs */
const { EmbedBuilder } = require('discord.js');
const { Command, CommandType } = require('gcommands');
const Player = require('../structures/Music/Player');
const { isUrl, search, getVideo } = require('../structures/Utils');

new Command({
	name: 'Add to Queue',
	description: 'Play song',
	type: [ CommandType.CONTEXT_MESSAGE ],
	run: async ({ client, reply, arguments, guild, member, interaction }) => {
		if (!member.voice?.channel) return reply({ content: 'Beep boop voice?', ephemeral: true });
		const queue = client.queue.get(guild.id);
		const a = arguments.getMessage('message');
		let query = a.content;

		interaction.deferReply();

		if (!isUrl(query)) query = (await search(query, 1))[0].value;
		if (!query) return interaction.editReply({ content: 'I didn\'t find any music. Sorry...', ephemeral: true });

		const videos = await getVideo(query);

		for (const video of videos) await Player.play(client, guild.id, member.voice.channel.id, video);

		if (queue) {
			if (videos.length <= 10) {
				if (videos.length = 1) {
					interaction.editReply({
      			embeds: [
        			new EmbedBuilder()
          			.setAuthor({ name: 'Added to Queue' })
          			.setDescription(`**Requested**: ${videos.length} song\n\n${videos.map((video, i) => { i++; return `\`${i}.\` ${video.title} - ${video.channel.name}`; }).slice(0, 10).join('\n')}`)
          			.setColor('Random')
          			.setTimestamp(),
      			],
    			});
				}
				else {
					interaction.editReply({
      			embeds: [
        			new EmbedBuilder()
          			.setAuthor({ name: 'Added to Queue' })
          			.setDescription(`**Requested**: ${videos.length} songs\n\n${videos.map((video, i) => { i++; return `\`${i}.\` ${video.title} - ${video.channel.name}`; }).slice(0, 10).join('\n')}`)
          			.setColor('Random')
          			.setTimestamp(),
      			],
    			});
				}
			}
			else {
				interaction.editReply({
      		embeds: [
        		new EmbedBuilder()
          		.setAuthor({ name: 'Added to Queue' })
          		.setDescription(`**Requested**: ${videos.length} songs\n\n${videos.map((video, i) => { i++; return `\`${i}.\` ${video.title} - ${video.channel.name}`; }).slice(0, 10).join('\n')}\nAnd more...`)
          		.setColor('Random')
          		.setTimestamp(),
      		],
    		});
			}
		}
		else if (videos.length <= 10) {
			if (videos.length = 1) {
				interaction.editReply({
      			embeds: [
        			new EmbedBuilder()
          			.setAuthor({ name: 'Added to Queue' })
          			.setDescription(`**Requested**: ${videos.length} song\n\n${videos.map((video, i) => { i++; return `\`${i}.\` ${video.title} - ${video.channel.name}`; }).slice(0, 10).join('\n')}`)
          			.setColor('Random')
          			.setTimestamp(),
      			],
    			});
			}
			else {
				interaction.editReply({
      			embeds: [
        			new EmbedBuilder()
          			.setAuthor({ name: 'Added to Queue' })
          			.setDescription(`**Requested**: ${videos.length} songs\n\n${videos.map((video, i) => { i++; return `\`${i}.\` ${video.title} - ${video.channel.name}`; }).slice(0, 10).join('\n')}`)
          			.setColor('Random')
          			.setTimestamp(),
      			],
    			});
			}
		}
		else {
			interaction.editReply({
      		embeds: [
        		new EmbedBuilder()
          		.setAuthor({ name: 'Playing Now' })
          		.setDescription(`**Requested**: ${videos.length} song(s)\n\n${videos.map((video, i) => { i++; return `\`${i}.\` ${video.title} - ${video.channel.name}`; }).slice(0, 10).join('\n')}\nAnd more...`)
          		.setColor('Random')
          		.setTimestamp(),
      		],
    		});
		}
	},
});