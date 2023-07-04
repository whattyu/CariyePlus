/* eslint-disable no-mixed-spaces-and-tabs */
const { Listener } = require('gcommands');
const Schema = require('../models/chatbotSchema.js');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
	apiKey: process.env.openai,
});
const openai = new OpenAIApi(configuration);

new Listener({
	name: 'chatbot',
	event: 'messageCreate',
	async run(message) {
		Schema.findOne({ Guild: message.guild.id }, async (e, data) => {
			if (!data) return;
			if (!message.guild) return;
			if (message.author.bot) return;
			if (data.Channel === '0') return;

			const channel = message.client.channels.cache.get(data.Channel);
			if (message.channel.id != channel.id) return;

			if (message.partial) {
				message.fetch().then(async fullMessage => {
					const completion = await openai.createCompletion({
    				model: 'text-davinci-003',
    				prompt: fullMessage.content,
  				});
  				message.channel.send(completion.data.choices[0].text);
				});
			}
			else {
				const completion = await openai.createCompletion({
    			model: 'text-davinci-003',
    			prompt: message.content,
  			});
				message.channel.send(completion.data.choices[0].text);
			}
		});
	},
});