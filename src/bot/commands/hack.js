/* eslint-disable no-shadow-restricted-names */
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');

new Command({
	name: 'hack',
	description: 'hack members not real',
	type: [ CommandType.SLASH ],
	arguments: [
		new Argument({
			name: 'member',
			description: 'tag member if u want',
			type: ArgumentType.USER,
		}),
	],
	async run({ reply, arguments, member, editReply }) {
		const hackedMember = arguments.getMember('member') || member;

		const hackedMesasges = [
			`Hacking ${hackedMember.user.username} now...`,
			'[▖] Finding discord login... (2fa bypassed)',

			`[▘] Found:
      Email: ${hackedMember.user.username + hackedMember.id.slice(13)}@gmail.com
      Token: ${Buffer.from(hackedMember.id + hackedMember.id.slice(6)).toString('base64')}`,

			`[▖] Injecting trojan virus into discriminator #${hackedMember.user.discriminator}`,
			'[▘] Finding IP address',
			`[▝] IP address: 127.0.0.1:${Math.floor(Math.random() * 999) + 100}`,
			'[▗] Reporting account to discord for breaking ToS...',
		];

		let count = 0;

		await reply(hackedMesasges[count++]);

		const interval = setInterval(() => {
			if (count == hackedMesasges.length) {
				editReply(`[▖] Finished hacking ${hackedMember.user.username}`);
				clearInterval(interval);
				return;
			}

			editReply(hackedMesasges[count++]);
		}, 3000);
	},
});