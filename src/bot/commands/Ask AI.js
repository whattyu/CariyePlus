/* eslint-disable no-shadow-restricted-names */
const { Command, CommandType } = require('gcommands');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
	apiKey: process.env.openai,
});
const openai = new OpenAIApi(configuration);

new Command({
	name: 'Ask to AI',
	description: 'Ask to AI',
	type: [CommandType.CONTEXT_MESSAGE],
	async run({ reply, arguments }) {
		const a = arguments.getMessage('message');
		const query = a.content;

		const completion = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: query,
		});

		return reply({ content: await completion.data.choices[0].text });
	},
});