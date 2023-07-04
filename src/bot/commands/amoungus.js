/* eslint-disable no-shadow-restricted-names */
const { EmbedBuilder } = require('discord.js');
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');

const who = ['amongus', 'crewmate'];
const random = who[Math.floor(Math.random() * who.length)];

new Command({
	name: 'amongus',
	description: 'are you imposter 🤨',
	type: [CommandType.SLASH],
	arguments: [
		new Argument({
			name: 'who',
			description: 'select user if you want',
			type: ArgumentType.USER,
			required: false,
		}),
	],
	async run({ reply, arguments, member }) {
		const search = arguments.getMember('who') || member;

		const embed = new EmbedBuilder()
			.setColor('Random')
			.setDescription(' 　　。 　　。　　ﾟ　　　.    　　　.   。　. 。    。 。' + '\n' + '.　。　　　.    。    .　　ﾟ　 。。 。。　　。   　.   。　.' + '\n' + '　.      。        ඞ   。    .    •。   。   。' + '\n' + `   •   .  ${search.user.username} was the ${random}. 。` + '\n' + '。　　。　　 。  。  。   。　ﾟ　　。     　.。   　.   。。 ' + '\n' + '　　 。　  。　　  　　.　　　  。   。　. 。      。  . 。');

		return reply({ embeds: [embed] });
	},
});