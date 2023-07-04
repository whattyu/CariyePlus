/* eslint-disable no-shadow */
const Discord = require('discord.js');
const { Command, CommandType } = require('gcommands');
const moment = require('moment');
require('moment-duration-format');

new Command({
	name: 'botinfo',
	description: 'shows bot info',
	type: [ CommandType.SLASH ],
	async run({ client, reply, guild, member, interaction }) {
		const ping = Date.now() - interaction.createdAt;
		let users = 0;
		for (guild of [...client.guilds.cache.values()]) users += guild.memberCount;

		const duration = moment
			.duration(client.uptime)
			.format(' D [days], H [hours], m [minutes], s [seconds]');

		const embed = new Discord.EmbedBuilder()
			.setAuthor({ name: 'Cariye+\'s Info', iconURL: client.user.avatarURL({ format: 'png' }) })
			.setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 4096 }))
			.setColor('Random')
			.addFields([
				{ name: 'About Me', value: `\n:man_technologist: **Developer:**\n whattyu#8272 | <@496328012741214208>\n\n :robot: **My Name:**\n Cariye+\n\n :id: **ID:**\n 849663572308918343\n\n **Servers and Users:**\n In ${client.guilds.cache.size} servers with ${users} users` },
				{ name: 'Technical Info', value: `\n**OS**\n ${process.platform.toUpperCase()}\n\n **Memory Usage**\n ${Math.floor((process.memoryUsage().heapUsed / 1024) / 1024)} MB\n\n **Status**\n :white_check_mark: I will always be online`, inline: true },
				{ name: 'Ping and Uptime', value: `\n**WS Ping**\n ${Math.floor(client.ws.ping)}ms\n\n **Bot Ping**\n ${ping}ms \n\n**Uptime**\n ${duration}`, inline: true },
				{ name: 'Versions', value: `\n**Discord.js Version**\n ${Discord.version}\n\n **Node.js Version**\n ${process.version}`, inline: true },
			])
			.setTimestamp()
			.setFooter({ text: member.user.username, iconURL: member.user.avatarURL({ format:'png' }) });

		const row = new Discord.ActionRowBuilder().addComponents([
			new Discord.ButtonBuilder()
				.setLabel('Invite me')
				.setURL('https://discord.com/api/oauth2/authorize?client_id=849663572308918343&permissions=8&scope=bot%20applications.commands')
				.setStyle(Discord.ButtonStyle.Link),

			new Discord.ButtonBuilder()
				.setLabel('Support Server')
				.setURL('https://discord.gg/J4wDA93rjd')
				.setStyle(Discord.ButtonStyle.Link),

			new Discord.ButtonBuilder()
				.setLabel('View on Top.gg')
				.setURL('https://top.gg/bot/849663572308918343')
				.setStyle(Discord.ButtonStyle.Link),
		]);

		return reply({
			embeds: [embed],
			components: [row],
		});
	},
});