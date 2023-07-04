const { EmbedBuilder } = require('discord.js');
const { Command, CommandType } = require('gcommands');
const { Color } = require('coloras');

new Command({
	name: 'color',
	description: 'sends random color',
	type: [ CommandType.SLASH ],
	async run({ reply, member }) {
		const random = new Color();

		const embed = new EmbedBuilder()
			.setAuthor({ name: `Random Color for ${member.user.username}` })
			.setColor(random.toHex())
			.addFields([
				{ name: 'HEX', value: random.toHex(), inline: true },
				{ name: 'RGB', value: random.toRgb(), inline: true },
				{ name: 'HSL', value: random.toHsl(), inline: true },
				{ name: 'HSV', value: random.toHsv(), inline: true },
				{ name: 'CMYK', value: random.toCmyk(), inline: true },
			])
			.setImage(random.imageUrl);

		return reply({
			embeds: [embed],
		});
	},
});