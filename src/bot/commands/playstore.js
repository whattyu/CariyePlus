/* eslint-disable no-shadow-restricted-names */
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const PlayStore = require('google-play-scraper');
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');

new Command({
	name: 'playstore',
	description: 'search apps in play store',
	type: [ CommandType.SLASH ],
	arguments: [
		new Argument({
			name: 'app',
			description: 'Application name',
			type: ArgumentType.STRING,
			required: true,
		}),
	],
	async run({ reply, arguments }) {
		const text = arguments.getString('app');

		PlayStore.search({
			term: text,
			num: 1,
		}).then(Data => {
			let App;

			try {
				App = JSON.parse(JSON.stringify(Data[0]));
			}
			catch (error) {
				return reply({
					content: 'No Application Found',
					ephemeral: true,
				});
			}

			const e = new EmbedBuilder()
				.setColor('Random')
				.setThumbnail(App.icon)
				.setTitle(`${App.title}`)
				.setDescription(App.summary)
				.addField('Price', App.priceText, true)
				.addField('Developer', App.developer, true)
				.addField('Score', App.scoreText, true)
				.setTimestamp();

			const row = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setLabel('App URL')
					.setURL(App.url)
					.setStyle(ButtonStyle.Link),
			]);

			return reply({
				embeds: [e],
				components: [row],
			});
		});
	},
});