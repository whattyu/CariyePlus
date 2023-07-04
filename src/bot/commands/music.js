/* eslint-disable no-constant-condition */
/* eslint-disable no-cond-assign */
/* eslint-disable no-shadow-restricted-names */
/* eslint-disable no-mixed-spaces-and-tabs */
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const lyricsFinder = require('lyrics-finder');
/* { getLyrics } = require("genius-lyrics-api")
const Genius = require("genius-lyrics");
const Client = new Genius.Client(process.env.gtoken);*/
const ProgressBar = require('../structures/ProgressBar');
const FormatTime = require('../structures/FormatTime');
const Player = require('../structures/Music/Player');
const { isUrl, search, getVideo } = require('../structures/Utils');

const generateRow = (disabled = null) => {
	const enable = new ButtonBuilder()
		.setLabel('Enable')
		.setStyle(ButtonStyle.Success)
		.setCustomId('enableLoop')
		.setDisabled(disabled ?? false);

	const disable = new ButtonBuilder()
		.setLabel('Disable')
		.setStyle(ButtonStyle.Danger)
		.setCustomId('disableLoop')
		.setDisabled(disabled ?? false);

	const cancel = new ButtonBuilder()
		.setLabel('Cancel')
		.setStyle(ButtonStyle.Secondary)
		.setCustomId('loopCancel')
		.setDisabled(disabled ?? false);

	const row = new ActionRowBuilder();
	row.addComponents([enable, disable, cancel]);

	return [row];
};

const genRow = (page, pages, isEmpty, disable) => {
	const pageL = new ButtonBuilder()
		.setLabel('Previous Page')
		.setStyle(ButtonStyle.Secondary)
		.setCustomId('pageL')
		.setDisabled((page === 0) || disable);

	const pageR = new ButtonBuilder()
		.setLabel('Next Page')
		.setStyle(ButtonStyle.Secondary)
		.setCustomId('pageR')
		.setDisabled((page === pages.length - 1) || disable);

	const skip = new ButtonBuilder()
		.setLabel('Skip')
		.setStyle(ButtonStyle.Secondary)
		.setCustomId('skip')
		.setDisabled((isEmpty) || disable);

	const cancel = new ButtonBuilder()
		.setLabel('Cancel')
		.setStyle(ButtonStyle.Danger)
		.setCustomId('cancel')
		.setDisabled(disable);

	const buttonRow = new ActionRowBuilder();
	buttonRow.addComponents([pageL, pageR, skip, cancel]);

	return [buttonRow];
};

new Command({
	name: 'music',
	description: 'music subcommand -> loop, lyrics, nowplaying, play, queue, skip, stop and volume commands',
	type: [CommandType.SLASH],
	arguments: [
		new Argument({
			name: 'loop',
			description: 'Turn on off loop',
			type: ArgumentType.SUB_COMMAND,
		}),
		new Argument({
			name: 'lyrics',
			description: 'shows lyrics of current playing song',
			type: ArgumentType.SUB_COMMAND,
		}),
		new Argument({
			name: 'nowplaying',
			description: 'Now playing',
			type: ArgumentType.SUB_COMMAND,
		}),
		new Argument({
			name: 'play',
			description: 'Play song(s)',
			type: ArgumentType.SUB_COMMAND,
			arguments: [
    		new Argument ({
      		name: 'query',
      		description: 'Query for search',
      		type: ArgumentType.STRING,
      		required: true,
					run: async (ctx) => {
        		const query = ctx.value || 'Never gonna give you up';
        		const videos = await search(query, 15);
        		ctx.respond(videos);
      		},
    		}),
  		],
		}),
		new Argument({
			name: 'queue',
			description: 'Check queue',
			type: ArgumentType.SUB_COMMAND,
		}),
		new Argument({
			name: 'skip',
			description: 'Skip song',
			type: ArgumentType.SUB_COMMAND,
		}),
		new Argument({
			name: 'stop',
			description: 'just stop',
			type: ArgumentType.SUB_COMMAND,
		}),
		new Argument({
			name: 'volume',
			description: 'Change the song volume',
			type: ArgumentType.SUB_COMMAND,
			arguments: [
    		new Argument({
      		name: 'volume',
      		description: 'volume',
      		type: ArgumentType.INTEGER,
      		required: true,
    		}),
  		],
		}),
	],
	async run({ client, reply, guild, member, interaction, channel, arguments }) {
		const sub = arguments.getSubcommand();
		const queue = client.queue.get(guild.id);

		if (!member.voice?.channel) return reply({ content: 'Beep boop voice?', ephemeral: true });

		if (sub === 'loop') {
			if (!queue) return reply({ content: 'Beep boop queue?', ephemeral: true });

			const message = await reply({
      	content: '• Turn loop on/off.',
      	components: generateRow(),
      	fetchReply: true,
    	});

    	const filter = i => i?.message?.id === message.id;
    	const collector = await channel.awaitMessageComponent({ filter, time: 60000, max: 1 });

    	if (!collector) {
      	interaction.editReply({
        	content: `• Loop is ${queue.loop ? 'on ✅' : 'off ❤️'}`,
        	components: generateRow(true),
      	});
      	return;
    	}

    	collector.deferUpdate();

    	if (collector.customId === 'enableLoop') queue.loop = true;
    	else if (collector.customId === 'disableLoop') queue.loop = false;

    	interaction.editReply({
      	content: `• Loop is ${queue.loop ? 'on ✅' : 'off ❤️'}`,
      	components: generateRow(true),
    	});
		}

		if (sub === 'lyrics') {
			if (!queue) return reply({ content: 'Beep boop queue?', ephemeral: true });

    	const lyrics = await lyricsFinder(queue.songs[0].title.replace('(Music Video)', '').replace('Music Video', '').replace(' (Music Video)', '').replace(' Music Video', '').replace('(Müzik Video)', '').replace('Müzik Video', '').replace('(Offical Video)', '').replace('Offical Video', '').replace(' | Offical Video', '').replace(' | (Offical Video)', '') + ' ' + queue.songs[0].channel.name);

			if (!lyrics) return reply({ content: 'Cannot find any lyrics for that song' });

			const embed = new EmbedBuilder()
      	.setAuthor({ name: `${queue.songs[0].title}'s Lyrics` })
      	.setFooter({ text: `From ${queue.songs[0].channel.name}` })
      	.setColor('Random')
      	.setThumbnail(queue.songs[0].thumbnail.url);

    	if (lyrics.length > 4096) {
      	embed.setDescription(`${lyrics.substr(0, 4093) + '…'}`);
    	}
			else {
      	embed.setDescription(lyrics);
    	}

    	return reply({
      	embeds: [embed],
    	});
		}

		if (sub === 'nowplaying') {
			if (!queue) return reply({ content: 'Beep boop queue?', ephemeral: true });

			const song = queue.songs[0];
    	const time = queue.connection.state.subscription.player.state.resource.playbackDuration;
    	const total = song.duration;

    	const embed = new EmbedBuilder()
      	.setAuthor({ name: 'Now Playing' })
      	.setTitle(song.title)
      	.setThumbnail(song.thumbnail.url)
				.setColor('Random');

    	if (song.live) {
      	embed.addFields([ { name: 'Time', value: ':red_circle: **LIVE**'.toString() } ]);
    	}
			else {
      	embed.addFields([ { name: 'Time', value: `${new ProgressBar(time / total, 15, client, false).toEmoji()}\n**${new FormatTime(Math.floor(time / 1000))} / ${new FormatTime(Math.floor(total / 1000))} - ${new FormatTime(Math.floor((total - time) / 1000))} left (${Math.floor((time / total) * 100)}%)**`.toString() } ]);
    	}

    	embed.addFields([ { name: 'Author', value: song.channel.name, inline: true } ]);

    	if (song.views) embed.addFields([ { name: 'Views', value: song.views.toLocaleString('en-US'), inline: true } ]);
    	if (song.playlist) embed.addFields([ { name: 'Playlist', value: `[${song.playlist.name}](${song.playlist.url})`.toString(), inline: true } ]);

    	return reply({
      	embeds: [embed],
    	});
		}

		if (sub === 'play') {
    	let query = arguments.getString('query');

    	interaction.deferReply();

    	if (!isUrl(query)) query = (await search(query, 1))[0].value;
    	if (!query) {
				return interaction.editReply({
      	content: 'I didn\'t find any music. Sorry...',
      	ephemeral: true,
    	});
			}

    	const videos = await getVideo(query);

    	for (const video of videos) await Player.play(client, guild.id, member.voice.channel.id, video);

			if (queue) {
				if (videos.length <= 10) {
					if (videos.length = 1) {
						interaction.editReply({
      				embeds: [
        				new EmbedBuilder()
          			.setAuthor({ name: 'Added to Queue' })
          			.setDescription(`**Requested**: ${videos.length} song\n\n${videos.map((video, i) => { i++; return `\`${i}.\` ${video.title} - ${video.channel.name}`; }).slice(0, 10).join('\n')}`)
          			.setColor('Random')
          			.setTimestamp(),
      				],
    				});
					}
					else {
						interaction.editReply({
      				embeds: [
        				new EmbedBuilder()
          			.setAuthor({ name: 'Added to Queue' })
          			.setDescription(`**Requested**: ${videos.length} songs\n\n${videos.map((video, i) => { i++; return `\`${i}.\` ${video.title} - ${video.channel.name}`; }).slice(0, 10).join('\n')}`)
          			.setColor('Random')
          			.setTimestamp(),
      				],
    				});
					}
				}
				else {
					interaction.editReply({
      			embeds: [
        			new EmbedBuilder()
          		.setAuthor({ name: 'Added to Queue' })
          		.setDescription(`**Requested**: ${videos.length} songs\n\n${videos.map((video, i) => { i++; return `\`${i}.\` ${video.title} - ${video.channel.name}`; }).slice(0, 10).join('\n')}\nAnd more...`)
          		.setColor('Random')
          		.setTimestamp(),
      			],
    			});
				}
			}
			else if (videos.length <= 10) {
				if (videos.length = 1) {
					interaction.editReply({
      				embeds: [
        				new EmbedBuilder()
          			.setAuthor({ name: 'Playing Now' })
          			.setDescription(`**Requested**: ${videos.length} song\n\n${videos.map((video, i) => { i++; return `\`${i}.\` ${video.title} - ${video.channel.name}`; }).slice(0, 10).join('\n')}`)
          			.setColor('Random')
          			.setTimestamp(),
      				],
    				});
				}
				else {
					interaction.editReply({
      				embeds: [
        				new EmbedBuilder()
          			.setAuthor({ name: 'Playing Now' })
          			.setDescription(`**Requested**: ${videos.length} songs\n\n${videos.map((video, i) => { i++; return `\`${i}.\` ${video.title} - ${video.channel.name}`; }).slice(0, 10).join('\n')}`)
          			.setColor('Random')
          			.setTimestamp(),
      				],
    				});
				}
			}
			else {
				interaction.editReply({
      			embeds: [
        			new EmbedBuilder()
          		.setAuthor({ name: 'Playing Now' })
          		.setDescription(`**Requested**: ${videos.length} song(s)\n\n${videos.map((video, i) => { i++; return `\`${i}.\` ${video.title} - ${video.channel.name}`; }).slice(0, 10).join('\n')}\nAnd more...`)
          		.setColor('Random')
          		.setTimestamp(),
      			],
    			});
			}
		}

		if (sub === 'queue') {
			if (!queue) return reply({ content: 'Beep boop queue?', ephemeral: true });

    	const arrows = ['⬐', '⬑'];
    	const dots = '…';

    	let pages = [];
    	let format = [];
    	let page = 0;

    	const fill = () => {
      	pages = [];
      	format = [];

      	for (let i = 0; i < queue.songs.length; i++) {
        	const song = queue.songs[i];

        	let prefix = '';
        	let suffix = '';

        	if (i === 0) {
          	const startOffset = ' '.repeat(2 + (i + 1).toString().length);
          	prefix = `${startOffset}${arrows[0]} Currently Playing\n`;
          	suffix = `\n${startOffset}${arrows[1]} Currently Playing`;
        	}

        	format.push(`${prefix}${i + 1}) ${song.title.length > 53 ? `${song.title.slice(0, 53)}${dots}` : song.title}${suffix}`);
      	}

      	const isEmpty = format.length < 1;
      	if (format.length < 1) format.push('Any songs!');

      	const max = 10;
      	for (let i = 0; i <= format.length; i += max) {
        	pages.push(format.slice(i, i + max));
      	}

      	return isEmpty;
    	};

    	let isEmpty = fill();

    	const message = await reply({
      	embeds: [
        	new EmbedBuilder()
          	.setAuthor({ name: 'Queue' })
          	.setTitle(`Page ${page}`)
          	.setDescription(`\`\`\`nim\n${pages[page].join('\n')}\`\`\``)
          	.setColor('Random'),
      	],
      	components: genRow(page, pages, isEmpty, false),
      	ephemeral: true,
      	fetchReply: true,
    	});

    	const filter = i => i?.message?.id === message.id;
    	const collector = channel.createMessageComponentCollector({ filter, time: 60000 });

    	collector.on('end', () => {
      	interaction.editReply({
       		embeds: [
          	new EmbedBuilder()
            	.setAuthor({ name: 'Queue' })
            	.setTitle(`Page ${page}`)
            	.setDescription(`\`\`\`nim\n${pages[page].join('\n')}\`\`\``)
            	.setColor('Random'),
        	],
        	components: genRow(page, pages, isEmpty, true),
        	ephemeral: true,
      	});
    	});

    	collector.on('collect', collected => {
      	collected.deferUpdate();

      	if (collected.customId === 'pageL' && page > 0) page--;
      	if (collected.customId === 'pageR' && page < pages.length) page++;
      	if (collected.customId === 'skip' && queue.connection) queue.connection.state.subscription.player.stop();

      	if (collected.customId === 'cancel') {
        	interaction.editReply({
          	embeds: [
            	new EmbedBuilder()
              	.setAuthor({ name: 'Queue' })
              	.setTitle(`Page ${page}`)
              	.setDescription(`\`\`\`nim\n${pages[page].join('\n')}\`\`\``)
              	.setColor('Random'),
          	],
          	components: genRow(page, pages, isEmpty, true),
          	ephemeral: true,
        	});
        	return;
      	}

      	isEmpty = fill();

      	interaction.editReply({
        	embeds: [
          	new EmbedBuilder()
            	.setAuthor({ name: 'Queue' })
            	.setTitle(`Page ${page}`)
            	.setDescription(`\`\`\`nim\n${pages[page].join('\n')}\`\`\``)
            	.setColor('Random'),
        	],
        	components: genRow(page, pages, isEmpty, false),
        	ephemeral: true,
      	});
    	});
		}

		if (sub === 'skip') {
    	if (!queue) return reply({ content: 'Beep boop queue?', ephemeral: true });

    	queue.connection.state.subscription.player.stop();

    	return reply({ content: 'Skipped!' });
		}

		if (sub === 'stop') {
    	if (!queue) return reply({ content: 'Beep boop queue?', ephemeral: true });

    	queue.connection.state.subscription.player.removeAllListeners();
    	queue.connection.destroy();
    	client.queue.delete(guild.id);

    	return reply({
      	content: 'Stopped!',
      	ephemeral: true,
    	});
		}

		if (sub === 'volume') {
    	if (!queue) return reply({ content: 'Beep boop queue?', ephemeral: true });
			const volum = queue.connection.state.subscription.player.state.resource.volume;

    	const volume = arguments.getInteger('volume');
			if (volume == (volum.volume * 100)) return reply({ content: 'The volume is already at ' + volume + '%', ephemeral: true });
    	if (volume > 100 || volume < 1) return reply({ content: 'No, `v<100 && v>1`', ephemeral: true });

    	volum.setVolume(volume / 100);

    	return reply({
      	content: `Done! New volume is \`${volume}%\``,
    	});
		}
	},
});