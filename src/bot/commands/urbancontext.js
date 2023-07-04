/* eslint-disable no-shadow-restricted-names */
const { Command, CommandType } = require('gcommands');
const urban = require('urban');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

new Command({
	name: 'Urban Dictionary',
	description: 'Urban Dictionary Search',
	type: [ CommandType.CONTEXT_MESSAGE ],
	async run({ reply, arguments }) {
		const w = arguments.getMessage('message');
		const a = w.content;

		urban(a).first((results) => {
			if (!results) {
				return reply({ content: 'This word doesn\'t exist', ephemeral: true });
			}
			const definition = results.definition;
			const link = results.permalink;
			const ex = results.example;
			const tup = results.thumbs_up;
			const tdown = results.thumbs_down;

			const e = new EmbedBuilder()
				.setTitle('Urban Dictionary')
				.setColor('Random')
				.setThumbnail('https://i.imgur.com/ALGVUh7.png')
				.addFields([
					{ name: 'Definition', value: definition },
					{ name: 'Example', value: ex },
				])
				.setFooter({
					text: `👍: ${tup} | 👎: ${tdown}`,
				});

			const row = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setLabel('See on page')
					.setURL(link)
					.setStyle(ButtonStyle.Link),
			]);

			return reply({
				embeds: [e],
				components: [row],
			});
		});
	},
});