/* eslint-disable no-shadow-restricted-names */
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const AppStore = require('app-store-scraper');
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');

new Command({
	name: 'appstore',
	description: 'search apps in app store',
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

		AppStore.search({
			term: text,
			num: 1,
		}).then(Data => {
			let App;

			try {
				App = JSON.parse(JSON.stringify(Data[0]));
			}
			catch (error) {
				console.log(error);
				return reply({
					content: 'No Application Found',
					ephemeral: true,
				});
			}

			const e = new EmbedBuilder()
				.setColor('Random')
				.setThumbnail(App.icon)
				.setTitle(`${App.title}`)
				.setDescription(App.description)
				.addFields([
					{ name: 'Price', value: App.price, inline: true },
					{ name: 'Developer', value: App.developer, inline: true },
					{ name: 'Score', value: App.scoreText, inline: true },
				])
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