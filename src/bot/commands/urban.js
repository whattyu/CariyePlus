/* eslint-disable no-shadow-restricted-names */
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const urban = require('urban');
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');

new Command({
	name: 'urban',
	description: 'Urban Dictionary Search',
	type: [ CommandType.SLASH ],
	arguments: [
		new Argument({
			name: 'word',
			description: 'Please write something to search on Urban Dictionary.',
			type: ArgumentType.STRING,
			required: true,
		}),
	],
	async run({ reply, arguments }) {
		const w = arguments.getString('word');

		urban(w).first((results) => {
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