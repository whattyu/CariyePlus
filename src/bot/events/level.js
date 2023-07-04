/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-inline-comments */
const { Listener } = require('gcommands');
const Schema = require('../models/levelSchema.js');
const Levels = require('discord-xp');
Levels.setURL(process.env.mongodb_uri);

new Listener({
	name: 'level',
	event: 'messageCreate',
	run: async (message) => {
		try {
    		Schema.findOne({ Guild: message.guild.id }, async (e, data) => {
      			if (!data) return;
      			if (!message.guild) return;
      			if (message.author.bot) return;
				if (data.Channel === '0') return;

      			const randomAmountOfXp = Math.floor(Math.random() * 24) + 1; // Min 1, Max 25
      			const hasLeveledUp = await Levels.appendXp(
        			message.author.id,
        			message.guild.id,
        			randomAmountOfXp,
      			);
      			if (hasLeveledUp) {
        			const user = await Levels.fetch(message.author.id, message.guild.id);
        			// const member = message.mentions.users.first() || message.author
       	 			const channel = message.guild.channels.cache.get(data.Channel);
        			channel.send(
          				`${message.author}, congratulations! :tada::tada: You Just Leveled Up \n ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ \n Your Current Level Is  **${user.level}**. :tada: \n  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ \n Keep Chatting For Leveling Up :tada::tada: \n ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ `,
        			);
      			}
    		});
  		}
		catch (e) {
			console.log(e);
    		message.channel.send(e);
  		}
	},
});