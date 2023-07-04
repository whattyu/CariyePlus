/* eslint-disable no-mixed-spaces-and-tabs */
const { Listener } = require('gcommands');
const { AutoPoster } = require('topgg-autoposter');
// const { RainbowRole } = require("djs-rainbow");
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
				'Searching for a new Name',
				'Hi! I need ur support on Top.gg',
			];
			const statuss = statuses[Math.floor(Math.random() * statuses.length)];
			client.user.setActivity(statuss, { type: ActivityType.Playing });
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