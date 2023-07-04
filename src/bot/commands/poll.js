const { Command, CommandType, Argument, ArgumentType, Inhibitor: { MemberPermissions } } = require('gcommands');
const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const ms = require('ms');

new Command({
	name: 'poll',
	description: 'Create a poll',
	type: [CommandType.SLASH],
	inhibitors: [
		new MemberPermissions({
			permissions: ['ManageGuild'],
			message: 'You haven\'t got permission for a create poll',
			ephemeral: true,
		}),
	],
	arguments: [
		new Argument({
			name: 'question',
			description: 'Poll Question',
			type: ArgumentType.STRING,
			required: true,
		}),
		new Argument({
			name: 'answera',
			description: 'Answer A',
			type: ArgumentType.STRING,
			required: true,
		}),
		new Argument({
			name: 'answerb',
			description: 'Answer B',
			type: ArgumentType.STRING,
			required: true,
		}),
		new Argument({
			name: 'time',
			description: '\\`Second (s) Minute (m) Hour (h) Day (d)\\` Example : \\`10s 10m 10h 10d\\`',
			type: ArgumentType.STRING,
			required: true,
		}),
	],
	async run(ctx) {
		const answra = ctx.arguments.getString('answera');
		const answrb = ctx.arguments.getString('answerb');
		const question = ctx.arguments.getString('question');
		const time = ms(ctx.arguments.getString('time'));

		const time_ = ms(time, { long: true });
		let votes_a = 0;
		let votes_b = 0;
		const alreadyvoted = [];
		const a = new Date();

		const buttons1 = new ActionRowBuilder().addComponents([
			new ButtonBuilder()
				.setLabel(`${answra}`)
				.setCustomId('a')
				.setStyle(ButtonStyle.Primary),

			new ButtonBuilder()
				.setLabel(`${answrb}`)
				.setCustomId('b')
				.setStyle(ButtonStyle.Primary),
		]);
		ctx.reply({ content: 'Poll created!', ephemeral: true });
		const embed = new EmbedBuilder()
			.setTitle('New Poll')
			.setDescription('If you want to vote, click on the desired button.')
			.addFields({ name: 'Question', value: question })
			.setFooter({ text: `The poll will end in, ${time_}` })
			.setTimestamp(`<t:${a}:R>`)
			.setColor('Random');

		const msg = await ctx.channel.send({
			embeds: [embed],
			components: [buttons1],
		});

		const thefilter = btn => btn.message.id === msg.id;
		const collector = ctx.channel.createMessageComponentCollector({ filter: thefilter, time: time });


		collector.on('collect', async (btn) => {
			if (alreadyvoted.includes(btn.user.id)) {
				const embed4 = new EmbedBuilder()
					.setTitle('You already voted!')
					.setColor('RED');
				btn.reply({ embeds: [embed4], ephemeral: true });
			}
			else if (btn.customId === 'a') {
				++votes_a;
				alreadyvoted.push(btn.user.id);
				console.log(alreadyvoted);
				const embed2 = new EmbedBuilder()
					.setTitle('Poll')
					.addField('Question', question, true)
					.setColor('RANDOM')
					.setDescription(`**${answra}**: ${votes_a} votes\n**${answrb}**: ${votes_b} votes`)
					.setFooter({ text: `The poll will end in, ${time_}` });
				msg.edit({
					embeds: [embed2],
				});
				btn.reply({ content: `You voted **${answra}**`, ephemeral: true });
			}
			else if (btn.customId === 'b') {
				++votes_b;
				alreadyvoted.push(btn.user.id);
				console.log(alreadyvoted);
				const embed2 = new EmbedBuilder()
					.setTitle('Poll')
					.addField('Question', question, true)
					.setColor('RANDOM')
					.setDescription(`**${answra}**: ${votes_a} votes\n**${answrb}**: ${votes_b} votes`)
					.setFooter({ text: `The poll will end in, ${time_}` });
				msg.edit({
					embeds: [embed2],
				});
				btn.reply({ content: `You voted **${answrb}**`, ephemeral: true });
			}
		});
		collector.on('end', async () => {
			const embed3 = new EmbedBuilder()
				.setTitle('This poll has ended!')
				.addField('Question', question, true)
				.setColor('DARK_RED')
				.setDescription(`**Results**:\n**${answra}**: ${votes_a} votes\n**${answrb}**: ${votes_b} votes`);
			const buttons2 = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setLabel('Ended!')
					.setCustomId('ended')
					.setStyle(ButtonStyle.Danger)
					.setDisabled(true),
			]);
			msg.edit({
				embeds: [embed3],
				components: [buttons2],
			});
		});
	},
});