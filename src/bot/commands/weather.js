/* eslint-disable no-shadow-restricted-names */
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const weather = require('weather-js');

new Command({
	name: 'weather',
	description: 'Shows the weather for the place from celcius',
	type: [CommandType.SLASH],
	arguments: [
		new Argument({
			name: 'location',
			description: 'location name',
			type: ArgumentType.STRING,
			required: true,
		}),
	],
	async run({ reply, arguments }) {
		const location = arguments.getString('location');
		await weather.find({ search: location, degreeType: 'C' }, function(err, result) {
			try {
				const e = new EmbedBuilder()
					.setTitle(`Weather in ${result[0].location.name.toString()}`)
					.setThumbnail(result[0].current.imageURL)
					.setColor('Random')
					.addFields([
						{ name: 'Date', value: result[0].current.date.toString() },
						{ name: 'Weather Event', value: result[0].current.skytext.toString() },
						{ name: 'Temperature', value: result[0].current.temperature.toString() },
						{ name: 'Feeling Temperature', value: result[0].current.feelslike.toString() },
						{ name: 'Humidity', value: result[0].current.humidity.toString() },
						{ name: 'Wind Speed', value: result[0].current.windspeed.toString() },
					]);

				return reply({ embeds: [e] });
			}
			catch (err) {
				return reply({
					content: err,
					ephemeral: true,
				});
			}
		});
	},
});