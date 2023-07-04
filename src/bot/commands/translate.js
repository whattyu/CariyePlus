/* eslint-disable no-shadow-restricted-names */
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');

new Command({
	name: 'translate',
	description: 'translate sentences/words',
	type: [ CommandType.SLASH ],
	arguments: [
		new Argument({
			name: 'tolang',
			description: 'what language do you want to translate',
			type: ArgumentType.STRING,
			required: true,
		}),
		new Argument({
			name: 'input',
			description: 'text write something to translate',
			type: ArgumentType.STRING,
			required: true,
		}),
	],
	async run({ reply, arguments }) {
		const input = arguments.getString('input');
		const language = arguments.getString('tolang');

		const res = await fetch(`https://luminabot.xyz/api/json/translate?text=${encodeURIComponent(input)}&tolang=${encodeURIComponent(language)}`);
		const response = res.json();

		const embed = new EmbedBuilder()
			.setTitle('Translator')
			.addFields(
				{ name: 'Input', value: response.input },
				{ name: 'Language', value: response.toLang },
				{ name: 'Output', value: response.translated },
			)
			.setColor('Random')
			.setThumbnail(response.image);

		return reply({ embeds: [embed] });
	},
});