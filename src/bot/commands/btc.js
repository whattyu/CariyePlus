const { EmbedBuilder } = require('discord.js');
const btcValue = require('btc-value');
const { Command, CommandType } = require('gcommands');
btcValue.setApiKey(process.env.btctoken);

new Command({
	name: 'bitcoin',
	description: 'Shows you information from Bitcoin',
	type: [ CommandType.SLASH ],
	async run({ reply }) {
		const value = await btcValue({ isDecimal: true });
		const hourPercentage = await btcValue.getPercentageChangeLastHour();
		const dayPercentage = await btcValue.getPercentageChangeLastDay();
		const weekPercentage = await btcValue.getPercentageChangeLastWeek();

		const embed = new EmbedBuilder()
			.setTitle('Bitcoin Info')
			.setThumbnail('https://i-invdn-com.investing.com/ico_flags/80x80/v32/bitcoin.png')
			.addFields([
				{ name: 'Current value', value: `${value.toString()}$` },
				{ name: 'Hour Percentage', value: `${hourPercentage.toString()}`, inline: true },
				{ name: 'Day Percentage', value: `${dayPercentage.toString()}`, inline: true },
				{ name: 'Week Percentage', value: `${weekPercentage.toString()}`, inline: true },
			])
			.setColor('Random');

		return reply({
			embeds: [embed],
		});
	},
});