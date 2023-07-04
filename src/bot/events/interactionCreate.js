const { Listener } = require('gcommands');
const { search } = require('youtube-sr').default;
const { InteractionType } = require('discord.js');

new Listener({
	name: 'interactionCreate',
	event: 'interactionCreate',
	run: async (interaction) => {
		if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
			const query = interaction.options.getString('query', true);
			const videos = await search(query || 'Never gonna give you up', { limit: 25 });

			interaction.respond(
				videos.map(video => {
					return {
						name: video.title,
						value: video.url,
					};
				}),
			);
		}
	},
});