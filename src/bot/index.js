const { MongoDBProvider } = require('gcommands/dist/providers/MongoDBProvider');
const { Collection, GatewayIntentBits, Partials } = require('discord.js');
const { GClient, Logger, Command, Component } = require('gcommands');
const { readFileSync } = require('fs');
const mongoose = require('mongoose');
const { join } = require('path');
require('@gcommands/plugin-language').default({ defaultLanguage: 'en-GB', languageText: JSON.parse(readFileSync(`${__dirname}/responses.json`, 'utf-8')) });
require('@gcommands/plugin-votes').default({ type: 'TOP.GG', apiKeys: process.env.topgg, serverAuthKey: process.env.topggwh });
require('dotenv').config();
require('../website.js');

Logger.setLevel(Logger.TRACE);

Command.setDefaults({ cooldown: '5s' });
Component.setDefaults({
	onError: (ctx, error) => {
		console.log(error);
		return ctx.reply('Oops! Something went wrong');
	},
});

const client = new GClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
		// GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
	dirs: [
		join(__dirname, 'commands'),
		join(__dirname, 'events'),
	],
	failIfNotExists: true,
	database: new MongoDBProvider(process.env.mongodb_uri),
	messageSupport: true,
	messagePrefix: '!',
	partials: [
		Partials.Channel, Partials.Message,
		Partials.Reaction, Partials.User,
		Partials.Role, Partials.GuildMember,
		Partials.GuildInvites, Partials.ManageGuild,
	],
});

client.config = require('./config.js');
client.db = new Collection();
client.queue = new Collection();

require('./structures/gwManager.js')(client);
require('./structures/gwEventsHandler.js')(client);

mongoose
	.connect(process.env.mongodb_uri, { useUnifiedTopology: true })
	.then(console.log('Success - Connected to MongoDatabase'));

client
	.on('error', console.log)
	.on('warn', console.log)
	.rest.on('rateLimited', console.log);

client.login(process.env.token);

/*
* kill 1
* I'll love the light for it shows me the way, yet I'll endure the darkness because it shows me the stars.
*
* @author
* Whattyu
*/