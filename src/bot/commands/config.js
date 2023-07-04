/* eslint-disable no-shadow-restricted-names */
/* eslint-disable no-mixed-spaces-and-tabs */
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const Schema = require('../models/levelSchema.js');
const CSchema = require('../models/chatbotSchema.js');
const WSchema = require('../models/welcomeSchema.js');
const Star = require('../models/stars.js');
// const HSchema = require("../models/hahaSchema.js");
const Admin = require('../inhibitors/AdminOnly.js');

new Command({
	name: 'config',
	description: 'config your chatbot channel, level channel and disable welcome event or set welcome channel',
	type: [CommandType.SLASH],
	inhibitors: [
		new Admin(),
	],
	arguments: [
		new Argument({
			name: 'check',
			description: 'check the systems',
			type: ArgumentType.SUB_COMMAND_GROUP,
			arguments: [
				new Argument({
      		name: 'chatbot',
      		description: 'check chatbot channel',
      		type: ArgumentType.SUB_COMMAND,
    		}),
				/* new Argument({
      		name: "haha",
      		description: "reacts to every message haha",
      		type: ArgumentType.SUB_COMMAND,
    		}),*/
				new Argument({
					name: 'level',
					description: 'check level channel',
					type: ArgumentType.SUB_COMMAND,
				}),
				new Argument({
					name: 'starboard',
					description: 'check starboard channel',
					type: ArgumentType.SUB_COMMAND,
				}),
				new Argument({
					name: 'welcome',
					description: 'check welcome channel and messages',
					type: ArgumentType.SUB_COMMAND,
				}),
			],
		}),
		new Argument({
			name: 'set',
			description: 'set chat bot, level channel and welcome channel',
			type: ArgumentType.SUB_COMMAND_GROUP,
			arguments: [
				new Argument({
      		name: 'chatbot',
      		description: 'set chat bot with ai',
      		type: ArgumentType.SUB_COMMAND,
					arguments: [
						new Argument({
      				name: 'channel',
      				description: 'select channel',
      				type: ArgumentType.CHANNEL,
							channelTypes: ['GUILD_TEXT'],
							required: true,
   					}),
					],
    		}),
				/* new Argument({
      		name: "haha",
      		description: "reacts to every message haha",
      		type: ArgumentType.SUB_COMMAND,
    		}),*/
				new Argument({
					name: 'level',
					description: 'enable level system',
					type: ArgumentType.SUB_COMMAND,
					arguments: [
						new Argument({
      				name: 'channel',
      				description: 'select channel',
      				type: ArgumentType.CHANNEL,
							channelTypes: ['GUILD_TEXT'],
      				required: true,
    				}),
					],
				}),
				new Argument({
					name: 'starboard',
					description: 'enable starboard',
					type: ArgumentType.SUB_COMMAND,
					arguments: [
						new Argument({
      				name: 'channel',
      				description: 'select starboard channel',
      				type: ArgumentType.CHANNEL,
							channelTypes: ['GUILD_TEXT'],
      				required: true,
    				}),
					],
				}),
				new Argument({
					name: 'welcome',
					description: 'enable welcome system',
					type: ArgumentType.SUB_COMMAND,
					arguments: [
						new Argument({
      				name: 'channel',
      				description: 'select channel',
      				type: ArgumentType.CHANNEL,
							channelTypes: ['GUILD_TEXT'],
      				required: true,
   					}),
						new Argument({
      				name: 'welcomemessage',
      				description: 'set welcome message',
      				type: ArgumentType.STRING,
      				required: true,
   					}),
						new Argument({
      				name: 'goodbyemessage',
      				description: 'set goodbye message',
      				type: ArgumentType.STRING,
      				required: true,
   					}),
					],
				}),
			],
		}),
		new Argument({
			name: 'disable',
			description: 'disable systems',
			type: ArgumentType.SUB_COMMAND_GROUP,
			arguments: [
				new Argument({
      		name: 'chatbot',
      		description: 'disable chat bot',
      		type: ArgumentType.SUB_COMMAND,
    		}),
				/* new Argument({
      		name: "haha",
      		description: "disable haha",
      		type: ArgumentType.SUB_COMMAND,
    		}),*/
				new Argument({
					name: 'level',
					description: 'disable level system',
					type: ArgumentType.SUB_COMMAND,
				}),
				new Argument({
					name: 'starboard',
					description: 'disable starboard',
					type: ArgumentType.SUB_COMMAND,
				}),
				new Argument({
					name: 'welcome',
					description: 'disable welcome system',
					type: ArgumentType.SUB_COMMAND,
				}),
			],
		}),
	],
	run: async ({ arguments, reply, guild }) => {
		const gr = arguments.getSubcommandGroup();
		const sub = arguments.getSubcommand();

		if (gr === 'check') {
			if (sub === 'chatbot') {

    		CSchema.findOne({ Guild: guild.id }, async (err, data) => {
					if (err) {
						console.log(err);
						return reply({ content: 'An error occurred', ephemeral: true });
					}
      		if (!data) return reply({ content: 'No data found', ephemeral: true });

        	if (data.Channel === '0') {
						return reply({ content: 'Chat bot is disabled', ephemeral: true });
					}
					else {
						return reply({ content: `Chat bot channel is -> <#${data.Channel}>` });
					}
    		});
			}

			/* if (sub === 'haha') {
    		HSchema.findOne({ Guild: guild.id }, async (err, data) => {
					if (!data) return reply({ content: "No data found probably <:haha:915632646728597505> System isn't setuped", ephemeral: true });
					if (data.Data === "0") return reply({ content: `<:haha:915632646728597505> is disabled now`, ephemeral: true });
      		if (data.Data === "1") return reply({ content: `<:haha:915632646728597505> is enabled now` });
    		});
			}*/

			if (sub === 'level') {
				Schema.findOne({ Guild: guild.id }, async (err, data) => {
					if (err) {
						console.log(err);
						return reply({ content: 'An error occurred', ephemeral: true });
					}
					if (!data) return reply({ content: 'No data found', ephemeral: true });

					if (data.Channel === '0') {
						return reply({ content: 'Level System is disabled', ephemeral: true });
      		}
					else {
        		return reply({ content: `Level channel is -> <#${data.Channel}>` });
      		}
				});
			}

			if (sub === 'starboard') {
				Star.findOne({ Guild: guild.id }, async (err, data) => {
					if (err) {
						console.log(err);
						return reply({ content: 'An error occurred', ephemeral: true });
					}
					if (!data) return reply({ content: 'No data found', ephemeral: true });

					if (data.Channel === '0') {
						return reply({ content: 'Starboard is disabled', ephemeral: true });
      		}
					else {
        		return reply({ content: `Starboard channel is -> <#${data.Channel}>` });
      		}
				});
			}

			if (sub === 'welcome') {
    		WSchema.findOne({ Guild: guild.id }, async (err, data) => {
					if (err) {
						console.log(err);
						return reply({ content: 'An error occurred', ephemeral: true });
					}
					if (!data) return reply({ content: 'No data found', ephemeral: true });

					if (data.Channel === '0') {
						return reply({ content: 'Welcome System is disabled', ephemeral: true });
					}
					else {
						const welcome = new EmbedBuilder()
        			.setColor('Random')
        			.setTitle('Welcome System')
        			.setDescription(`Welcome Channel:\n> <#${data.Channel}>\n\nWelcome Message:\n> ${data.WMessage}\n\nGoodbye Message:\n> ${data.BMessage}`);
						return reply({ embeds: [welcome] });
					}
    		});
			}
		}

		if (gr === 'set') {
			if (sub === 'chatbot') {
				const channel = arguments.getChannel('channel');

    		CSchema.findOne({ Guild: guild.id }, async (err, data) => {
					if (err) {
						console.log(err);
						return reply({ content: 'An error occurred', ephemeral: true });
					}
      		if (data) {
        		data.Channel = channel.id;
        		data.save();
      		}
					else {
        		new CSchema({
          		Guild: guild.id,
          		Channel: channel.id,
        		}).save();
      		}

					return reply({ content: `Chat bot is successfully setted to <#${channel.id}>`, ephemeral: true });
    		});
			}

			/* if (sub === 'haha') {
				HSchema.findOne({ Guild: guild.id }, async (err, data) => {
					if (err) {
						console.log(err)
						return reply({ content: `An error occurred`, ephemeral: true })
					}
      		if (data) {
        		data.Channel = '1';
        		data.save();
      		} else {
        		new HSchema({
          		Guild: guild.id,
          		Data: '1',
        		}).save();
      		}

					let a = await reply({ content: "<:haha:915632646728597505> is successfully setted", fetchReply: true });
					a.react("<:haha:915632646728597505>");
    		});
			}*/

			if (sub === 'level') {
				const channel = arguments.getChannel('channel');

    		Schema.findOne({ Guild: guild.id }, async (err, data) => {
					if (err) {
						console.log(err);
						return reply({ content: 'An error occurred', ephemeral: true });
					}
      		if (data) {
        		data.Channel = channel.id;
        		data.save();
      		}
					else {
        		new Schema({
          		Guild: guild.id,
          		Channel: channel.id,
        		}).save();
      		}

      		const levelup = new EmbedBuilder()
        		.setColor('Random')
        		.setTitle('Level-UP Channel')
        		.setDescription(`${channel} has been set as a Level-UP Channel`)
        		.setThumbnail('https://media.tenor.com/images/610d120b3b048f6487ad7555e94591bc/tenor.gif');

					await reply({ content: 'Level channel is successfully setted', ephemeral: true });
      		await channel.send({ embeds: [levelup] });
    		});
			}

			if (sub === 'starboard') {
				const channel = arguments.getChannel('channel');

    		Star.findOne({ Guild: guild.id }, async (err, data) => {
					if (err) {
						console.log(err);
						return reply({ content: 'An error occurred', ephemeral: true });
					}
      		if (data) {
        		data.Channel = channel.id;
        		data.save();
      		}
					else {
        		new Schema({
          		Guild: guild.id,
          		Channel: channel.id,
        		}).save();
      		}

      		const levelup = new EmbedBuilder()
        		.setColor('Random')
        		.setTitle('Starboard Channel')
        		.setDescription(`${channel} has been set as a Starboard Channel`);

					return reply({ embeds: [levelup], ephemeral: true });
    		});
			}

			if (sub === 'welcome') {
				const channel = arguments.getChannel('channel');
				const welcomemessage = arguments.getString('welcomemessage');
				const byemessage = arguments.getString('goodbyemessage');

    		WSchema.findOne({ Guild: guild.id }, async (err, data) => {
					if (err) {
						console.log(err);
						return reply({ content: 'An error occurred', ephemeral: true });
					}
      		if (data) {
        		data.Channel = channel.id;
						data.WMessage = welcomemessage;
						data.BMessage = byemessage;
        		data.save();
      		}
					else {
        		new WSchema({
          		Guild: guild.id,
          		Channel: channel.id,
							WMessage: welcomemessage,
							BMessage: byemessage,
        		}).save();
      		}

      		const welcome = new EmbedBuilder()
        		.setColor('Random')
        		.setTitle('Welcome Channel')
        		.setDescription(`${channel} has been set as a Welcome Channel\n Welcome Message:\n> ${welcomemessage}\n\n Goodbye Message:\n> ${byemessage}`);

					await reply({ content: 'Welcome channel is successfully setted', ephemeral: true });
      		await channel.send({ embeds: [welcome] });
    		});
			}
		}

		if (gr === 'disable') {
			if (sub === 'chatbot') {
				CSchema.findOne({ Guild: guild.id }, async (err, data) => {
					if (err) {
						console.log(err);
						return reply({ content: 'An error occurred', ephemeral: true });
					}
					if (!data.Channel) return reply({ content: 'ChatBot isn\'t setuped' });
					if (data.Channel === '0') return reply({ content: 'ChatBot already disabled' });
      		if (data) {
        		data.Channel = '0';
        		data.save();
      		}
					else {
        		new CSchema({
          		Guild: guild.id,
          		Channel: '0',
        		}).save();
      		}

					await reply({ content: 'ChatBot is successfully disabled', ephemeral: true });
    		});
			}

			/* if (sub === 'haha') {
				HSchema.findOne({ Guild: guild.id }, async (err, data) => {
					if (err) {
						console.log(err)
						return reply({ content: `An error occurred`, ephemeral: true })
					}
					if (data.Data === '0') return reply({ content: 'HAHA is already disabled' });
      		if (data) {
        		data.Data = '0';
        		data.save();
      		} else {
        		new HSchema({
          		Guild: guild.id,
          		Data: '0',
        		}).save();
      		}

					return reply({ content: "<:haha:915632646728597505> is successfully disabled", ephemeral: true });
    		});
			}*/

			if (sub === 'level') {
				Schema.findOne({ Guild: guild.id }, async (err, data) => {
					if (err) {
						console.log(err);
						return reply({ content: 'An error occurred', ephemeral: true });
					}
					if (!data.Channel) return reply({ content: 'Level System isn\'t setuped' });
					if (data.Channel === '0') return reply({ content: 'Level System already disabled' });
      		if (data) {
        		data.Channel = '0';
        		data.save();
      		}
					else {
        		new Schema({
          		Guild: guild.id,
          		Channel: '0',
        		}).save();
      		}

					return reply({ content: 'Level channel is successfully disabled', ephemeral: true });
    		});
			}

			if (sub === 'starboard') {
				Star.findOne({ Guild: guild.id }, async (err, data) => {
					if (err) {
						console.log(err);
						return reply({ content: 'An error occurred', ephemeral: true });
					}
					if (!data.Channel) return reply({ content: 'Starboard isn\'t setuped' });
					if (data.Channel === '0') return reply({ content: 'Starboard already disabled' });
      		if (data) {
        		data.Channel = '0';
        		data.save();
      		}
					else {
        		new Schema({
          		Guild: guild.id,
          		Channel: '0',
        		}).save();
      		}
					return reply({ content: 'Level channel is successfully disabled', ephemeral: true });
    		});
			}

			if (sub === 'welcome') {
    		Schema.findOne({ Guild: guild.id }, async (err, data) => {
					if (err) {
						console.log(err);
						return reply({ content: 'An error occurred', ephemeral: true });
					}
					if (!data.Channel) return reply({ content: 'Welcome System already disabled' });
					if (data.Channel === '0') return reply({ content: 'Welcome System already disabled' });
      		if (data) {
        		data.Channel = '0';
        		data.save();
      		}
					else {
        		new WSchema({
          		Guild: guild.id,
          		Channel: '0',
        		}).save();
      		}

					return reply({ content: 'Welcome channel is successfully disabled', ephemeral: true });
    		});
			}
		}
	},
});