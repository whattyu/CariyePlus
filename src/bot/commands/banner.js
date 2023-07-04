/* eslint-disable no-shadow-restricted-names */
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
	name: 'banner',
	description: 'get member banner',
	type: [ CommandType.SLASH ],
	arguments: [
		new Argument({
			name: 'user',
			description: 'Select user',
			type: ArgumentType.USER,
			required: false,
		}),
	],
	async run({ reply, arguments, member }) {
		const target = arguments.getMember('user') || member;

		let receive = '';
		let banner =
      'https://cdn.discordapp.com/attachments/829722741288337428/834016013678673950/banner_invisible.gif';

		const res = await fetch(`https://discord.com/api/v8/users/${target.id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bot ${process.env.token}`,
			},
		});

		if (res.status !== 404) {
			const json = await res.json();
			receive = json['banner'];
		}

		if (receive) {
			const res2 = await fetch(
				`https://cdn.discordapp.com/banners/${target.id}/${receive}.gif`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bot ${process.env.token}`,
					},
				},
			);

			banner = `https://cdn.discordapp.com/banners/${target.id}/${receive}.gif?size=4096`;
			if (res2.status === 415) {
				banner = `https://cdn.discordapp.com/banners/${target.id}/${receive}.png?size=4096`;
			}
		}
		else {
			return reply({
				content: 'Couldn\'t find any profile banner set up!',
				ephemeral: true,
			});
		}

		const bannerEmbed = new EmbedBuilder()
			.setColor('Random')
			.setAuthor({
				name: `${target.user.username}'s Profile Banner`,
			})
			.setImage(banner);

		return reply({
			embeds: [bannerEmbed],
		});
	},
});