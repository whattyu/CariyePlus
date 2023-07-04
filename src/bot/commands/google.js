/* eslint-disable no-shadow-restricted-names */
const googleIt = require('google-it');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');

new Command({
	name: 'google',
	description: 'Google it',
	type: [CommandType.SLASH],
	arguments: [
		new Argument({
			name: 'search',
			description: 'Please write something to Google it!',
			type: ArgumentType.STRING,
			required: true,
		}),
	],
	async run({ reply, arguments }) {
		const mes = arguments.getString('search');

		googleIt({ query: mes, 'no-display': 1, limit: 10 }).then((results) => {
			if (!results) return reply('No results found!');

			const tit1 = results[0].title;
			const link1 = results[0].link;
			const tit2 = results[1].title;
			const link2 = results[1].link;
			const tit3 = results[2].title;
			const link3 = results[2].link;
			const tit4 = results[3].title;
			const link4 = results[3].link;
			const tit5 = results[4].title;
			const link5 = results[4].link;

			const e = new EmbedBuilder()
				.setTitle(`Here its the search results for ${mes.toLowerCase()}`)
				.setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png')
				.addField(
					'Search Results',
					`1- ${tit1}\n 2- ${tit2}\n 3- ${tit3}\n 4- ${tit4}\n 5- ${tit5}\n\n You can go link from buttons`,
				)
				.setColor('Random');

			const row = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setLabel(`${tit1}`)
					.setURL(link1)
					.setStyle(ButtonStyle.Link),

				new ButtonBuilder()
					.setLabel(`${tit2}`)
					.setURL(link2)
					.setStyle(ButtonStyle.Link),

				new ButtonBuilder()
					.setLabel(`${tit3}`)
					.setURL(link3)
					.setStyle(ButtonStyle.Link),

				new ButtonBuilder()
					.setLabel(`${tit4}`)
					.setURL(link4)
					.setStyle(ButtonStyle.Link),

				new ButtonBuilder()
					.setLabel(`${tit5}`)
					.setURL(link5)
					.setStyle(ButtonStyle.Link),
			]);

			return reply({
				embeds: [e],
				components: [row],
			});
		});
	},
});