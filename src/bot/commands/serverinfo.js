/* eslint-disable no-shadow */
const { Command, CommandType } = require('gcommands');
const { EmbedBuilder, ChannelType, GuildVerificationLevel, GuildExplicitContentFilter, GuildNSFWLevel, time } = require('discord.js');

new Command({
	name: 'serverinfo',
	description: 'shows server info',
	type: [ CommandType.SLASH ],
	async run({ reply, guild }) {
		const { members, channels, emojis, roles, stickers } = guild;

		const sortedRoles = roles.cache.map(role => role).slice(1, roles.cache.size).sort((a, b) => b.position - a.position);
		const userRoles = sortedRoles.filter(role => !role.managed);
		const managedRoles = sortedRoles.filter(role => role.managed);
		const botCount = members.cache.filter(member => member.user.bot).size;

		const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
			let totalLength = 0;
			const result = [];

			for (const role of roles) {
				const roleString = `<@&${role.id}>`;

				if (roleString.length + totalLength > maxFieldLength) break;

				totalLength += roleString.length + 1;
				result.push(roleString);
			}

			return result.length;
		};

		const splitPascal = (string, separator) => string.split(/(?=[A-Z])/).join(separator);
		const toPascalCase = (string, separator = false) => {
			const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
			return separator ? splitPascal(pascal, separator) : pascal;
		};

		const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size;

		const totalChannels = getChannelTypeSize([
			ChannelType.GuildText,
			ChannelType.GuildVoice,
			ChannelType.GuildStageVoice,
			ChannelType.GuildForum,
			ChannelType.GuildCategory,
		]);

		return reply({
			embeds: [
				new EmbedBuilder()
					.setColor('Random')
					.setTitle(`${guild.name}'s Information`)
					.setThumbnail(guild.iconURL({ size: 4096 }))
					.setImage(guild.bannerURL({ size: 4096 }))
					.addFields([
						{ name: 'Description', value: `📝 ${guild.description || 'None'}` },
						{
							name: 'General',
							value: [
								`📜 **Created** ${time(guild.createdTimestamp, 'F')}`,
								`💳 **ID** ${guild.id}`,
								`👑 **Owner** <@${guild.ownerId}>`,
								`🌍 **Language** ${new Intl.DisplayNames(['en'], { type: 'language' }).of(guild.preferredLocale)}`,
								`💻 **Vanity URL** ${guild.vanityURLCode || 'None'}`,
							].join('\n'),
						},
						{ name: 'Features', value: guild.features?.map(feature => `- ${toPascalCase(feature, ' ')}`)?.join('\n') || 'None', inline: true },
						{
							name: 'Security',
							value: [
								`👀 **Explicit Filter** ${splitPascal(GuildExplicitContentFilter[guild.explicitContentFilter], ' ')}`,
								`🔞 **NSFW Level** ${splitPascal(GuildNSFWLevel[guild.nsfwLevel], ' ')}`,
								`🔒 **Verification Level** ${splitPascal(GuildVerificationLevel[guild.verificationLevel], ' ')}`,
							].join('\n'),
							inline: true,
						},
						{
							name: `Users (${guild.memberCount})`,
							value: [
								`👨‍👩‍👧‍👦 **Members** ${guild.memberCount - botCount}`,
								`🤖 **Bots** ${botCount}`,
							].join('\n'),
							inline: true,
						},
						{ name: `User Roles (${maxDisplayRoles(userRoles)} of ${userRoles.length})`, value: `${userRoles.slice(0, maxDisplayRoles(userRoles)).join(' ') || 'None'}` },
						{ name: `Managed Roles (${maxDisplayRoles(managedRoles)} of ${managedRoles.length})`, value: `${managedRoles.slice(0, maxDisplayRoles(managedRoles)).join(' ') || 'None'}` },
						{
							name: `Channels, Threads & Categories (${totalChannels})`,
							value: [
								`💬 **Text** ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum])}`,
								`🎙 **Voice** ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`,
								`🧵 **Threads** ${getChannelTypeSize([ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, ChannelType.GuildNewsThread])}`,
								`📑 **Categories** ${getChannelTypeSize([ChannelType.GuildCategory])}`,
							].join('\n'),
							inline: true,
						},
						{
							name: `Emojis & Stickers (${emojis.cache.size + stickers.cache.size})`,
							value: [
								`📺 **Animated** ${emojis.cache.filter(emoji => emoji.animated).size}`,
								`🗿 **Static** ${emojis.cache.filter(emoji => !emoji.animated).size}`,
								`🏷 **Stickers** ${stickers.cache.size}`,
							].join('\n'),
							inline: true,
						},
						{
							name: 'Nitro',
							value: [
								`📈 **Tier** ${guild.premiumTier || 'None'}`,
								`💪🏻 **Boosts** ${guild.premiumSubscriptionCount}`,
								`💎 **Boosters** ${guild.members.cache.filter(member => member.roles.premiumSubscriberRole).size}`,
								`🏋🏻‍♀️ **Total Boosters** ${guild.members.cache.filter(member => member.premiumSince).size}`,
							].join('\n'),
							inline: true,
						},
						{ name: 'Banner', value: guild.bannerURL() ? '** **' : 'None' },
					]),
			],
		});
	},
});


/*
let veriflevel = {
			NONE: "None",
			LOW: "Low",
			MEDIUM: "Medium",
			HIGH: "High - (╯°□°）╯︵  ┻━┻",
			VERY_HIGH: "Highest - ┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
		};

		let ow = guild.members.cache.get(guild.ownerId);
		let owner = ow.user.username;

		//guild.members.fetch({ withPresences: true }).then(fetchedMembers => {
			/*const online = fetchedMembers.filter(member => member.presence?.status === 'online');
			const idle = fetchedMembers.filter(member => member.presence?.status === 'idle');
			const dnd = fetchedMembers.filter(member => member.presence?.status === 'dnd');
			const offline = fetchedMembers.filter(member => member.presence?.status === 'offline');*

			let embed = new EmbedBuilder()
      	.setTitle(`:computer: ・ ${guild.name}'s Informations`)
      	.setColor("Random")
      	.addFields([
        	{ name: `:crown: ・ Server Owner`, value: `${owner}`, inline: true },
        	{ name: ":id: ・ Server ID", value: `${guild.id}`, inline: true },
        	{ name: "Boost Level", value: `${guild.premiumSubscriptionCount}` },
        	{ name: "Verification Level", value: `${veriflevel[guild.verificationLevel]}`},
       		{ name: ":calendar: ・ Created At", value: `≫ ${time(guild.createdTimestamp, 'F')}` },
        	/*{
						name: `👤 ・ Members (${guild.memberCount.toString()})`,
						value: `**Online Members**: ${online.size.toString()}\n**Idle Members**: ${idle.size.toString()}\n**DND Members**: ${dnd.size.toString()}\n**Offine Members**: ${offline.size.toString()}`
					},*
        	{ name: ":robot: ・ Bots:", value: `${guild.members.cache.filter(m => m.user.bot).size.toString()}` },
        	{ name: "・ Roles", value: `${guild.roles.cache.size.toString()}` },
        	{
						name: `📜 ・ Total Channel Size: ${guild.channels.cache.size.toString()}`,
						value: `Voice Channels: ${guild.channels.cache.filter(c => c.type === 'GuildVoice').size.toString()} Text Channels: ${guild.channels.cache.filter(c => c.type === 'GuildText').size.toString()}`,
						inline: true
					},
        	{ name: `Total Emojis ・ ${guild.emojis.cache.size.toString()}`, value: `${[...guild.emojis.cache.values()] || "not found any emojis"}` },
      	])
      	.setThumbnail(`${guild.iconURL({ dynamic: true, format: "png", size: "4096" }) || ""}`)
     		.setTimestamp()

    	return reply({ embeds: [embed] })
		//});

*/