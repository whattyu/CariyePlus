/* eslint-disable no-shadow-restricted-names */
/* eslint-disable no-mixed-spaces-and-tabs */
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
	apiKey: process.env.openai,
});
const openai = new OpenAIApi(configuration);

new Command({
	name: 'image-generate',
	description: 'create image',
	type: [ CommandType.SLASH ],
	arguments: [
		new Argument({
			name: 'prompt',
			description: 'enter a prompt',
			type: ArgumentType.STRING,
			required: true,
		}),
	],
	async run({ reply, arguments }) {
		const prompt = arguments.getString('prompt');

		const response = await openai.createImage({
  		prompt: prompt,
  		n: 1,
  		size: '1024x1024',
		});

		const e = new EmbedBuilder()
			.setTitle(prompt)
			.setColor('Random')
			.setThumbnail(response.data.data[0].url);

		return reply({
			embeds: [e],
		});
	},
});