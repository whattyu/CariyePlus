const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { Command, CommandType } = require('gcommands');

new Command({
	name: 'advice',
	description: 'gives u an advice',
	nameLocalizations: {
		'tr': 'tavsiye',
	},
	descriptionLocalizations: {
		'tr': 'tavsiye ister misin',
	},
	type: [ CommandType.SLASH ],
	async run({ reply, interaction }) {
		const buff = await axios.get('https://api.adviceslip.com/advice');
		const embed = new EmbedBuilder()
			.setDescription(`${buff.data.slip.advice}`)
			.setColor('Random');
		await reply({ embeds: [embed] });
		await interaction.followUp({ content: 'Hi! Do you have any name suggestions for me if you have come to our server and suggest it https://discord.gg/J4wDA93rjd', ephemeral: true });
	},
});