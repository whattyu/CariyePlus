/* eslint-disable no-mixed-spaces-and-tabs */
const { Listener } = require('gcommands');
const Schema = require('../models/welcomeSchema.js');
const { EmbedBuilder } = require('discord.js');

new Listener({
	name: 'guildMemberRemove',
	event: 'guildMemberRemove',
	run: async (member) => {
		try {
    		Schema.findOne({ Guild: member.guild.id }, async (e, data) => {
      			if (!data) return;
				if (data.Channel === '0') return;

				const channel = member.guild.channels.cache.get(data.Channel);
				const welcome = new EmbedBuilder()
					.setAuthor({
						name: `${member.user.username} is left from the server`,
						iconUrl: member.user.displayAvatarURL({ dynamic: true }) || '',
					})
					.setColor('Random')
      				.setDescription(data.BMessage)
      				.setThumbnail('https://media4.giphy.com/media/Bht33KS4YXaHS5ABOP/giphy.gif')
					.setTimestamp(Date.now());

    			channel.send({ embeds: [welcome] });
    		});
  		}
		catch (e) {
			console.log(e);
    		member.channel.send({ content: 'Error', ephemeral: true });
  		}
	},
});