/* eslint-disable */
const { Command, CommandType, Inhibitor: { MemberPermissions } } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
	name: 'banlist',
	description: 'get ban list',
	defaultMemberPermissions: ['BanMembers'],
	inhibitors: [
		new MemberPermissions({
			permissions: ['BanMembers'],
			message: 'You can\'t use this command!',
			ephemeral: true,
		}),
	],
	type: [ CommandType.SLASH ],
	async run({ reply, guild }) {
		guild.bans.fetch()
			.then(banned => {
			  let list = banned.map(ban => '`' + ban.user.tag + '`').join('\n');

				if (list.length >= 1950) list = `${list.slice(0, 1947)}...`;

				const embed = new EmbedBuilder()
      	  .setTitle('Ban List')
      	  .setDescription(list)
      	  .setColor('Random')
      	  .setTimestamp();

    	  return reply({
      	  embeds: [embed],
    	  });
			});
	},
});