const axios = require('axios')
const { EmbedBuilder } = require('discord.js')
const { Command, CommandType, Argument, ArgumentType } = require("gcommands");

new Command({
  name: "covid",
  description: "Display coronavirus stats",
  type: [ CommandType.SLASH ],
  arguments: [
    new Argument({
      name: "country",
      description: "name of country",
      type: ArgumentType.STRING,
      required: true,
    })
  ],
  async run({ reply, arguments }) {
    let baseUrl = "https://corona.lmao.ninja/v2";
    let country = arguments.getString('country');

    let url, response, corona;

    try {
      url = country ? `${baseUrl}/countries/${country}` : `${baseUrl}/all`
      response = await axios.get(url)
      corona = response.data
    } catch (error) {
      return reply({
        content: `***${country}*** doesn't exist, or data isn't being collected`,
        ephemeral: true
      })
    }

    const embed = new EmbedBuilder()
      .setTitle(country ? `${country.toUpperCase()} Stats` : 'Total Corona Cases World Wide')
      .setColor("Random")
      .setThumbnail(country ? corona.countryInfo.flag : 'https://i.giphy.com/YPbrUhP9Ryhgi2psz3.gif')
      .addFields([
        {
          name: 'Total Cases:',
          value: corona.cases.toLocaleString(),
          inline: true
        },
        {
          name: 'Total Deaths:',
          value: corona.deaths.toLocaleString(),
          inline: true
        },
        {
          name: 'Total Recovered:',
          value: corona.recovered.toLocaleString(),
          inline: true
        },
        {
          name: 'Active Cases:',
          value: corona.active.toLocaleString(),
          inline: true
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: true
        },
        {
          name: 'Critical Cases:',
          value: corona.critical.toLocaleString(),
          inline: true
        },
        {
          name: 'Today Recoveries:',
          value: corona.todayRecovered.toLocaleString().replace("-", ""),
          inline: true
        },
        {
          name: 'Todays Deaths:',
          value: corona.todayDeaths.toLocaleString(),
          inline: true
        }
      ])
    return reply({
      embeds: [embed]
    })
  }
})