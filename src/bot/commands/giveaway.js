/* eslint-disable no-shadow-restricted-names */
/* eslint-disable no-mixed-spaces-and-tabs */
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { VoteInhibitor } = require('@gcommands/plugin-votes');
const ms = require('ms');

new Command({
	name: 'giveaway',
	description: 'giveaway system',
	inhibitors: [
		new VoteInhibitor({
			message: 'You must be vote me if you want to use this command ⬎\nhttps://top.gg/bot/849663572308918343/vote',
		}),
	],
	arguments: [
		new Argument({
			name: 'start',
			description: '🎉 Starts a giveaway',
			type: ArgumentType.SUB_COMMAND,
			arguments: [
				new Argument({
					name: 'length',
					description: 'Enter the length of the giveaway',
					type: ArgumentType.STRING,
					required: true,
				}),
				new Argument({
					name: 'prize',
					description: 'Set a prize to win',
					type: ArgumentType.STRING,
					required: true,
				}),
				new Argument({
					name: 'winners',
					description: 'Enter the number of winners',
					type: ArgumentType.NUMBER,
					required: true,
				}),
				new Argument({
					name: 'channel',
					description: 'Specify the channel where to send the giveaway',
					type: ArgumentType.CHANNEL,
					channelTypes: ['GUILD_TEXT'],
					required: false,
				}),
			],
		}),
		new Argument({
			name: 'pause',
			description: '⏸️ Pauses the giveaway',
			type: ArgumentType.SUB_COMMAND,
			arguments: [
				new Argument({
					name: 'message-id',
					description: 'Specify giveaway message id',
					type: ArgumentType.STRING,
					required: true,
				}),
			],
		}),
		new Argument({
			name: 'unpause',
			description: '⏯️ Unpauses the giveaway',
			type: ArgumentType.SUB_COMMAND,
			arguments: [
				new Argument({
					name: 'message-id',
					description: 'Specify giveaway message id',
					type: ArgumentType.STRING,
					required: true,
				}),
			],
		}),
		new Argument({
			name: 'end',
			description: '⏹️ Ends the giveaway',
			type: ArgumentType.SUB_COMMAND,
			arguments: [
				new Argument({
					name: 'message-id',
					description: 'Specify giveaway message id',
					type: ArgumentType.STRING,
					required: true,
				}),
			],
		}),
		new Argument({
			name: 'reroll',
			description: '🔃 Selects a new giveaway winner',
			type: ArgumentType.SUB_COMMAND,
			arguments: [
				new Argument({
					name: 'message-id',
					description: 'Specify giveaway message id',
					type: ArgumentType.STRING,
					required: true,
				}),
			],
		}),
		new Argument({
			name: 'delete',
			description: '🚮 Deletes the giveaway',
			type: ArgumentType.SUB_COMMAND,
			arguments: [
				new Argument({
					name: 'message-id',
					description: 'Specify giveaway message id',
					type: ArgumentType.STRING,
					required: true,
				}),
			],
		}),
	],
	type: [ CommandType.SLASH ],
	async run({ interaction, client, reply, channel, arguments, member }) {
		if (!member.permissions.has([ PermissionsBitField.Flags.ManageGuild, PermissionsBitField.Flags.Administrator ])) {
			return reply({ content: 'You don\'t have enough permissions', ephemeral: true });
		}

		const sub = arguments.getSubcommand();

		const errorEmbed = new EmbedBuilder().setColor('Red');
		const successEmbed = new EmbedBuilder().setColor('Random');

		if (sub === 'start') {
			const gchannel = arguments.getChannel('channel') || channel;
			const duration = arguments.getString('length');
			const winnerCount = arguments.getNumber('winners');
			const prize = arguments.getString('prize');
			if (isNaN(ms(duration))) {
				errorEmbed.setDescription('❌ | Enter the correct giveaway length format! `1d, 1h, 1m, 1s`');
				return reply({ embeds: [errorEmbed], ephemeral: true });
			}

			return client.giveawaysManager.start(gchannel, {
				duration: ms(duration),
				winnerCount,
				prize,
				messages: client.config.messages,
			}).then(async () => {
				if (client.config.giveawayManager.everyoneMention) {
        	const msg = await gchannel.send({ content: '@everyone' });
					msg.delete();
				}
				successEmbed.setDescription(`✅ | Giveaway started in ${gchannel}!`);
				return reply({ embeds: [successEmbed], ephemeral: true });
			}).catch((err) => {
				console.log(err);
        	errorEmbed.setDescription(`❌ | Error \n\`${err}\``);
				return reply({ embeds: [errorEmbed], ephemeral: true });
			});
		}

		const messageid = arguments.getString('message-id');
		const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageid);
		if (!giveaway) {
			errorEmbed.setDescription(`❌ | Giveaway with ID ${messageid} was not found in the database!`);
			return reply({ embeds: [errorEmbed], ephemeral: true });
		}

		if (sub === 'pause') {
			if (giveaway.isPaused) {
				errorEmbed.setDescription('❌ | This giveaway is already paused!');
			}
			await client.giveawaysManager.pause(arguments.getString('message-id'), {
				content: client.config.messages.paused,
				infiniteDurationText: client.config.messages.infiniteDurationText,
			}).then(() => {
				successEmbed.setDescription('⏸️ | The giveaway has been paused!');
				return reply({ embeds: [successEmbed], ephemeral: true });
			}).catch((err) => {
				errorEmbed.setDescription(`❌ | Error \n\`${err}\``);
				return reply({ embeds: [errorEmbed], ephemeral: true });
			});
		}

		if (sub === 'unpause') {
			await client.giveawaysManager.unpause(arguments.getString('message-id')).then(() => {
      	successEmbed.setDescription('▶️ | The giveaway has been paused!');
				return reply({ embeds: [successEmbed], ephemeral: true });
			}).catch((err) => {
				errorEmbed.setDescription(`❌ | Error \n\`${err}\``);
				return reply({ embeds: [errorEmbed], ephemeral: true });
			});
		}

		if (sub === 'end') {
			await client.giveawaysManager.end(arguments.getString('message-id')).then(() => {
				successEmbed.setDescription('⏹️ | The giveaway has been stopped!');
				return reply({ embeds: [successEmbed], ephemeral: true });
			}).catch((err) => {
				errorEmbed.setDescription(`❌ | Error \n\`${err}\``);
				return reply({ embeds: [errorEmbed], ephemeral: true });
			});
		}

		if (sub === 'reroll') {
			await client.giveawaysManager.reroll(arguments.getString('message-id'), {
				messages: {
					congrat: client.config.messages.congrat,
					error: client.config.messages.error,
				},
			}).then(() => {
				successEmbed.setDescription('🎉 | The giveaway has a new winner!');
				return reply({ embeds: [successEmbed], ephemeral: true });
			}).catch((err) => {
				errorEmbed.setDescription(`❌ | Error \n\`${err}\``);
				return reply({ embeds: [errorEmbed], ephemeral: true });
			});
		}

		if (sub === 'delete') {
			await client.giveawaysManager.delete(arguments.getString('message-id')).then(() => {
      	successEmbed.setDescription('🚮 | The giveaway has been deleted!');
				return reply({ embeds: [successEmbed], ephemeral: true });
			}).catch((err) => {
				errorEmbed.setDescription(`❌ | Error \n\`${err}\``);
				return reply({ embeds: [errorEmbed], ephemeral: true });
			});
		}
	},
});