/* eslint-disable no-shadow-restricted-names */
/* eslint-disable no-mixed-spaces-and-tabs */
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const mcping = require('mcping-js');

new Command({
	name: 'mcserver',
	description: 'Displays the current status and active players for your server',
	type: [CommandType.SLASH],
	arguments: [
		new Argument({
			name: 'ip',
			description: 'ip adress',
			type: ArgumentType.STRING,
			required: true,
		}),
		new Argument({
			name: 'port',
			description: 'port (default is 25565)',
			type: ArgumentType.NUMBER,
			required: false,
		}),
	],
	async run({ reply, arguments }) {
		const ip = arguments.getString('ip');
		const port = arguments.getNumber('number') || 25565;
		let serverStatus;

		const server = new mcping.MinecraftServer(ip, port);
		server.ping(2500, 47, async function(err, res) {
			if (err) {
				const offlineEmbed = new EmbedBuilder()
					.setTitle(`Status for ${ip}:${port}`)
					.setDescription('*The server is offline!*')
					.setColor('Random');
				return reply({ embeds: [offlineEmbed], ephemeral: true });
			}
			else {
      	if (typeof res.players.sample == 'undefined') {
					serverStatus = '*No one is playing!*';
				}
				else {
					let onlinePlayers = [];
					for (let i = 0; i < res.players.sample.length; i++) {
						onlinePlayers.push(res.players.sample[i].name);
					}
					onlinePlayers = onlinePlayers.sort().join(', ').replace(/\u00A7[0-9A-FK-OR]|\\n/ig, '');
					serverStatus = `**${res.players.online}/${res.players.max}** player(s) online.\n\n${onlinePlayers}`;
				}
				const responseEmbed = new EmbedBuilder()
					.setTitle(`Status for ${ip}:${port}`)
					.setColor('Random')
					.setDescription(serverStatus)
					.addFields([ { name: 'Server version:', value: res.version.name } ])
					.setThumbnail(`https://api.mcsrvstat.us/icon/${ip}:${port}`);
				return reply({ embeds: [responseEmbed] });
			}
		});
	},
});