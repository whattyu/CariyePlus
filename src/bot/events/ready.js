/* eslint-disable no-mixed-spaces-and-tabs */
const { Listener } = require('gcommands');
const { AutoPoster } = require('topgg-autoposter');
const { ActivityType } = require('discord.js');
const fetch = require('node-fetch');
const play = require('play-dl');

new Listener({
	name: 'ready',
	event: 'ready',
	run(client) {
		let users = 0;
		for (const guild of [...client.guilds.cache.values()]) users += guild.memberCount;

		console.log([
			`${client.user.tag} is ready!`,
			'',
			`Servers: ${client.guilds.cache.size}`,
			`Users: ${users}`,
		].join('\n'));

		// client.user.setActivity('Hello', { type: ActivityType.Playing });

		play.authorization();

		setInterval(() => {
			const statuses = [
				'have a lovely day',
				`with ${users} users`,
				`in ${client.guilds.cache.size} servers`,
				'ready for all commands',
				'/help',
				'Hi! I need ur support on Top.gg',
				'with other bots if u say they better than me',
			];
			const statuss = statuses[Math.floor(Math.random() * statuses.length)];
			let type;
			if (statuss == 'have a lovely day') type = ActivityType.Playing;
			if (statuss == `with ${users} users`) type = ActivityType.Playing;
			if (statuss == `in ${client.guilds.cache.size} servers`) type = ActivityType.Playing;
			if (statuss == 'Ready for all commands') type = ActivityType.Playing;
			if (statuss == '/help') type = ActivityType.Playing;
			if (statuss == 'Hi! I need ur support on Top.gg') type = ActivityType.Playing;
			if (statuss == 'in with other bots if u say they better than me') type = ActivityType.Competing;
			client.user.setActivity(statuss, { type: type });
		}, 125000);

		setInterval(() => {
			AutoPoster(process.env.topgg, client);
			fetch('https://api.voidbots.net/bot/stats/849663572308918343', {
    		method: 'POST',
    		headers: {
      		Authorization: process.env.voidtoken,
      		'Content-Type': 'application/json',
    		},
    		body: JSON.stringify({ 'server_count': client.guilds.cache.size, 'shard_count': 1 }),
  		}).then(response => response.text()).then(console.log).catch(console.error);
		}, 300000);
	},
});
