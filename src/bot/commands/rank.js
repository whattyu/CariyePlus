/* eslint-disable no-inline-comments */
/* eslint-disable no-shadow-restricted-names */
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder/* , Attachment*/ } = require('discord.js');
const Levels = require('discord-xp');
Levels.setURL(process.env.mongodb_uri);
// const canvacord = require("canvacord");

new Command({
	name: 'rank',
	description: 'Shows your current rank!',
	type: [ CommandType.SLASH ],
	arguments: [
		new Argument({
			name: 'user',
			description: 'select an user if you want',
			type: ArgumentType.USER,
			required: false,
		}),
	],
	async run({ reply, guild, member, arguments }) {
		try {
			const target = arguments.getMember('user') || member;
			const user = await Levels.fetch(target.id, guild.id);
			const neededXp = Levels.xpFor(parseInt(user.level) + 1);

			/* const rank = new canvacord.Rank()
        .setAvatar(
          target.displayAvatarURL({ dynamic: false, format: "png" })
        )
        .setCurrentXP(user.xp)
        .setLevel(user.level)
        .setRequiredXP(neededXp)
        .setStatus(target.presence.status || "")
        .setProgressBar("WHITE", "COLOR")
        .setUsername(target.user.username)
        .setDiscriminator(target.user.discriminator);

      rank.build().then((data) => {
        const file = new AttachmentBuilder(data, { name: "rank.png" });
				const e = new EmbedBuilder()
					.setImage('attachment://rank.png')
					.setColor("Random")

        return reply({
					embeds: [e],
					files: [file]
				})
      })*/
			console.log(user.position);
			const e = new EmbedBuilder()
				.setTitle(`${target.user.tag}'s Rank`)
				.addFields([
					{ name: 'Level:', value: user.level.toLocaleString() },
					{ name: 'XP:', value: `${user.xp.toLocaleString()}/${neededXp.toLocaleString()}` },
					// { name: "Rank:",   }
				])
				.setColor('Random')
				.setThumbnail(target.displayAvatarURL({ dynamic: false, format: 'png' }) || '');

			return reply({
				embeds: [e],
			});
		}
		catch (e) {
			console.log(e);
		}
	},
});