/* eslint-disable no-shadow-restricted-names */
const { EmbedBuilder } = require('discord.js');
const imdb = require('imdb-api');
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const x = new imdb.Client({ apiKey: process.env.imdb });

new Command({
	name: 'imdb',
	description: 'Get the information about series and movie',
	type: [ CommandType.SLASH ],
	arguments: [
		new Argument({
			name: 'moviename',
			description: 'text the movie name',
			type: ArgumentType.STRING,
			required: true,
		}),
	],
	async run({ reply, arguments }) {
		const text = arguments.getString('moviename');
		const movie = x.get({ 'name': text });

		if (!movie) return reply({ content: 'I dont find the movie' });

		const embed = new EmbedBuilder()
			.setTitle(movie.title.toString())
			.setColor('Random')
			.setThumbnail(movie.poster)
			.setDescription(movie.plot)
			.addFields([
				{ name: 'Country', value: movie.country },
				{ name: 'Languages', value: movie.languages },
				{ name: 'Type', value: movie.type },
			])
			.setFooter({ text: `Ratings: ${movie.rating}` });

		return reply({
			embeds: [embed],
		});
	},
});