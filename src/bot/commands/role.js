const { Command, CommandType, Argument, ArgumentType, Inhibitor: { MemberPermissions } } = require('gcommands');
const ms = require('ms');

new Command({
	name: 'role',
	description: 'Add-remove role',
	type: [ CommandType.SLASH ],
	inhibitors: [
		new MemberPermissions({
			permissions: [ 'Administrator' ],
			message: 'You haven\'t got enough permissions',
			ephemeral: true,
		}),
	],
	arguments: [
		new Argument({
			name: 'mass',
			description: 'Role for everyone',
			type: ArgumentType.SUB_COMMAND_GROUP,
			arguments: [
				new Argument({
					name: 'add',
					description: 'Add role to everyone',
					type: ArgumentType.SUB_COMMAND,
					arguments: [
						new Argument({
							name: 'role',
							description: 'Select role',
							type: ArgumentType.ROLE,
							required: true,
						}),
					],
				}),
				new Argument({
					name: 'remove',
					description: 'Remove role from everyone',
					type: ArgumentType.SUB_COMMAND,
					arguments: [
						new Argument({
							name: 'role',
							description: 'Select role',
							type: ArgumentType.ROLE,
							required: true,
						}),
					],
				}),
			],
		}),
		new Argument({
			name: 'single',
			description: 'Role for single user',
			type: ArgumentType.SUB_COMMAND_GROUP,
			arguments: [
				new Argument({
					name: 'add',
					description: 'Add role for user',
					type: ArgumentType.SUB_COMMAND,
					arguments: [
						new Argument({
							name: 'role',
							description: 'Select role',
							type: ArgumentType.ROLE,
							required: true,
						}),
						new Argument({
							name: 'user',
							description: 'Select user',
							type: ArgumentType.USER,
							required: true,
						}),
					],
				}),
				new Argument({
					name: 'remove',
					description: 'Remove role from user',
					type: ArgumentType.SUB_COMMAND,
					arguments: [
						new Argument({
							name: 'role',
							description: 'Select role',
							type: ArgumentType.ROLE,
							required: true,
						}),
						new Argument({
							name: 'user',
							description: 'Select user',
							type: ArgumentType.USER,
							required: true,
						}),
					],
				}),
			],
		}),
	],
	run: async (ctx) => {
		const subgroup = ctx.arguments.getSubcommandGroup();
		const sub = ctx.arguments.getSubcommand();
		const role = ctx.arguments.getRole('role');

		if (subgroup === 'mass') {
			if (sub === 'add') {
				let members = (await ctx.guild.members.fetch());
				members = [...members.values()];
				members = members.filter(m => !m.roles.cache.has(role.id));

				members.forEach((member) => {
					member.roles.add(role);
				});

				ctx.reply({
					content: `ETA: ${ms(members.length * 1000)}`,
				});
			}
			else {
				let members = (await ctx.guild.members.fetch());
				members = [...members.values()];
				members = members.filter(m => m.roles.cache.has(role.id));

				members.forEach((member) => {
					member.roles.remove(role);
				});

				ctx.reply({
					content: `ETA: ${ms(members.length * 1000)}`,
				});
			}
		}
		else {
			const member = ctx.arguments.getMember('user');

			if (sub === 'add') {

				if (member.roles.cache.has(role.id)) {
					ctx.reply({
						content: `${member.user.username} already have this role!`,
						ephemeral: true,
					});
					return;
				}
				member.roles.add(role)
					.then(() => {
						ctx.reply({
							content: 'Added!',
							ephemeral: true,
						});
					})
					.catch(e => {
						ctx.reply({
							content: e,
							ephemeral: true,
						});
					});
			}
			else {

				member.roles.remove(role)
					.then(() => {
						ctx.reply({
							content: 'Removed!',
							ephemeral: true,
						});
					})
					.catch(e => {
						ctx.reply({
							content: e,
							ephemeral: true,
						});
					});
			}
		}
	},
});