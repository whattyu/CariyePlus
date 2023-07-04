const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const randomPuppy = require('random-puppy');

new Command({
	name: 'meme',
	description: 'sends an epic memes',
	type: [CommandType.SLASH],
	async run({ reply }) {
		const subReddits = ['dankmeme', 'meme', 'me_irl', 'memes', 'comedyheaven', 'Animemes', 'memes', 'dankmemes', 'ComedyCemetery', 'terriblefacebookmemes', 'funny'];
		const random = subReddits[Math.floor(Math.random() * subReddits.length)];
		const img = await randomPuppy(random);

		const embed = new EmbedBuilder()
			.setColor('Random')
			.setImage(img)
			.setTitle(`Meme z r/${random}`)
			.setURL(`https://reddit.com/r/${random}`)
			.setDescription(`If image is dont load [click here](${img})`);

		return reply({
			embeds: [embed],
		});
	},
});