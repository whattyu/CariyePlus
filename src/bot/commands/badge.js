/* eslint-disable no-shadow-restricted-names */
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const badges = require('../structures/badge/index');

new Command({
	name: 'badge',
	description: 'shows member badge(s)',
	type: [ CommandType.SLASH ],
	arguments: [
		new Argument({
			name: 'member',
			description: 'select member if you want',
			type: ArgumentType.USER,
			required: false,
		}),
	],
	async run({ reply, member, client, arguments }) {
		const b = arguments.getMember('member');
		const c = b || member;
		const a = client.users.cache.get(c.user.id);
		badges
			.badges(a)
			.then((response) => {
				let result = '';
				for (let i = 0; i < response.length; i++) {
					result += `**${response[i].name} - ** ${response[i].url}\n`;
				}
				return reply({
					content: result,
				});
			}).catch(() => {
				// console.log(e)
				return reply({
					content: b ? `${b.user.username} dont have any badges...` : 'you dont have no badges..',
					ephemeral: true,
				});
			});
	},
});