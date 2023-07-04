const { Command, CommandType } = require('gcommands');

new Command({
	name: 'ping',
	description: 'Checks the bots latency',
	type: [ CommandType.SLASH ],
	async run({ client, reply, interaction }) {
		const ping =
      Date.now() - interaction.createdAt;
		return reply({
			content: `**My Ping:** **\`${ping}ms\`**\n**WS Ping:** **\`${client.ws.ping}ms\`**`,
			ephemeral: true,
		});
	},
});