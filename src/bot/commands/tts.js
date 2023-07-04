/* eslint-disable no-shadow-restricted-names */
/* eslint-disable no-mixed-spaces-and-tabs */
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { getAudioUrl } = require('google-tts-api');

new Command({
	name: 'tts',
	description: 'text to speech',
	type: [ CommandType.SLASH ],
	arguments: [
		new Argument({
			name: 'text',
			description: 'provide a text',
			type: ArgumentType.STRING,
			required: true,
		}),
	],
	async run({ reply, arguments, channel, member }) {
		const string = arguments.getString('text');
		const voiceChannel = member.voice.channel;

		if (string.length > 500) return reply({ content: 'I can only speak 500 words!', ephemeral: true });
		if (!voiceChannel) return reply({ content: 'Please join a voice channel to use this command!', ephemeral: true });

		const audioUrl = await getAudioUrl(string, {
			lang: 'en',
			slow: false,
			host: 'https://translate.google.com',
			timeout: 20000,
		});

		const player = createAudioPlayer();
		const resource = createAudioResource(audioUrl);

		const connection = joinVoiceChannel({
			channelId: member.voice.channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});

		player.play(resource);
		connection.subscribe(player);

		player.on(AudioPlayerStatus.Idle, () => {
  		connection.disconnect();
		});
	},
});