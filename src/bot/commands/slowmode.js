/* eslint-disable no-shadow-restricted-names */
const { Command, CommandType, Argument, ArgumentType, Inhibitor: { MemberPermissions } } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const ms = require('ms');

new Command({
	name: 'slowmode',
	description: 'enable or disable slowmode for channel',
	defaultMemberPermissions: ['ManageChannels'],
	inhibitors: [
		new MemberPermissions({
			permissions: ['ManageChannels'],
			message: 'You can\'t use this command!',
			ephemeral: true,
		}),
	],
	type: [ CommandType.SLASH ],
	arguments: [
		new Argument({
			name: 'time',
			description: 'time units - h(hour), m(minute), s(seconds) if you want disable type 0',
			type: ArgumentType.STRING,
			required: true,
		}),
		new Argument({
			name: 'reason',
			description: 'provide a reason if you want',
			type: ArgumentType.STRING,
			required: false,
		}),
	],
	async run({ reply, arguments, channel }) {
		const a = arguments.getString('time');
		const reason = arguments.getString('reason') || 'Not Specified';
		const currentSlowmode = channel.rateLimitPerUser;

		if (a === '0') {
			if (currentSlowmode === 0) {
				const slowmodeOfferror = new EmbedBuilder()
					.setDescription('Slowmode is already off')
					.setColor('Random');

				return reply({
					embeds: [slowmodeOfferror],
					ephemeral: true,
				});
			}
			channel.setRateLimitPerUser(0, reason);

			return reply({
				content: 'Slowmode Disabled',
				ephemeral: true,
			});
		}

		const time = ms(a) / 1000;
		const slowmodeError3 = new EmbedBuilder()
			.setDescription('This is not a valid time. Please write the time in the units mentioned. \n\n Time Units - h(hour), m(minute), s(seconds) \n (Example - ?slowmode 5s)')
			.setColor('RANDOM');
		if (isNaN(time)) {
			return reply({
				embeds: [slowmodeError3],
				ephemeral: true,
			});
		}

		if (time > 21600000) {
			return reply({
				content: 'Time is too high. Make sure its below 6 hours.',
				ephemeral: true,
			});
		}

		if (currentSlowmode === time) {
			return reply({
				content: `Slowmode is already set to ${a}`,
				ephemeral: true,
			});
		}

		await channel.setRateLimitPerUser(time, reason);
		const afterSlowmode = channel.rateLimitPerUser;
		if (afterSlowmode > 0) {
			const embed = new EmbedBuilder()
				.setTitle('Slowmode Enabled')
				.addFields([
					{ name: 'Slowmode Duration', value: a },
					{ name: 'Reason', value: reason },
				])
				.setColor('Random');

			return reply({
				embeds: [embed],
			});
		}
		else if (afterSlowmode === 0) {
			return reply({
				embeds: [slowmodeError3],
				ephemeral: true,
			});
		}
	},
});