/* eslint-disable no-shadow-restricted-names */
const { Command, CommandType, Argument, ArgumentType, Inhibitor: { MemberPermissions } } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
	name: 'purge',
	description: 'purge messages',
	defaultMemberPermissions: ['ManageChannels'],
	type: [ CommandType.SLASH ],
	arguments: [
		new Argument({
			name: 'amount',
			description: 'amount of purged message(s)',
			type: ArgumentType.INTEGER,
			required: true,
		}),
		new Argument({
			name: 'channel',
			description: 'select channel if u want',
			type: ArgumentType.CHANNEL,
			channelTypes: ['GUILD_TEXT'],
			required: false,
		}),
	],
	inhibitors: [
		new MemberPermissions({
			permissions: ['ManageChannels'],
			message: 'You cant use this command!',
			ephemeral: true,
		}),
	],
	async run({ reply, arguments, channel, member }) {
		try {
			const amount = arguments.getInteger('amount');
			const a = arguments.getChannel('channel');
			const c = a || channel;
			if (amount < 1 || amount > 100) return reply({ content: 'You need to input a number between 1 and 99.', ephemeral: true });
			c.bulkDelete(parseInt(amount), true);
			const embed = new EmbedBuilder()
				.setTitle('Purged')
				.setColor('Random')
				.setDescription(`${amount} message(s) in <#${c.id}>`)
				.setFooter({ text: `From ${member.user.username}`, iconURL: member.user.avatarURL() })
				.setTimestamp();
			return reply({ embeds: [embed], ephemeral: true });
		}
		catch (e) {
			console.log(e);
			return reply({ content: 'An error occurred, please try again', ephemeral: true });
		}
	},
});