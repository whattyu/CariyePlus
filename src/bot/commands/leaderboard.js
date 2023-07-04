const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const Levels = require('discord-xp');
Levels.setURL(process.env.mongodb_uri);

new Command({
	name: 'leaderboard',
	description: 'Shows the message experience leaderboard',
	type: [ CommandType.SLASH ],
	async run({ client, reply, guild }) {
		const rawLeaderboard = await Levels.fetchLeaderboard(guild.id, 10);

		if (rawLeaderboard.length < 1) return reply({ content: 'Nobody\'s in leaderboard yet.', ephemeral: true });

		const leaderboard = await Levels.computeLeaderboard(
			client,
			rawLeaderboard,
			true,
		);

		const lb = leaderboard.map(
			(e) =>
				`${e.position}. ${e.username}#${e.discriminator}\nLevel: ${
					e.level
				}\nXP: ${e.xp.toLocaleString()}`,
		);

		const lb2 = new EmbedBuilder()
			.setColor('Random')
			.setTitle('**Leaderboard**')
			.setDescription(`\n\n${lb.join('\n\n')}`);

		return reply({
			embeds: [lb2],
		});
	},
});