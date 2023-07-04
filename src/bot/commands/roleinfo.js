/* eslint-disable no-shadow-restricted-names */
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
	name: 'roleinfo',
	description: 'shows roles info',
	type: [ CommandType.SLASH ],
	arguments: [
		new Argument({
			name: 'role',
			description: 'tag a role',
			type: ArgumentType.ROLE,
			required: true,
		}),
	],
	async run({ reply, arguments }) {
		const targetRole = arguments.getRole('role');

		const e = new EmbedBuilder()
			.setTitle(`:satellite: ${targetRole.name}'s Info`)
			.setColor(targetRole.hexColor || 'Random')
			.addFields([
				{ name: ':id: Role Id', value: targetRole.id, inline: true },
				{ name: ':curly_loop: Role Position', value: targetRole.position.toString(), inline: true },
				{ name: ':person_frowning: Member Size', value: targetRole.members.size.toString(), inline: true },
				{ name: 'Role Is Separate From Others ?', value: targetRole.hoist.toString(), inline: true },
				{ name: 'Role Is Mentionable?', value: targetRole.mentionable.toString(), inline: true },
				{ name: 'Role Permissions', value: targetRole.permissions.toArray().toString() },
			]);
		if (targetRole.iconURL()) e.setThumbnail(targetRole.iconURL({ dynamic: true, format: 'png', size: 4096 }));

		return reply({
			embeds: [e],
		});
	},
});