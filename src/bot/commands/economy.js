/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-shadow */
/* eslint-disable no-shadow-restricted-names */
// const { EmbedBuilder } = require('discord.js');
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { VoteInhibitor } = require('@gcommands/plugin-votes');
const Schema = require('../models/ecoSchema.js');

// eslint-disable-next-line no-unused-vars
const a = [
	{
		'name': 'pizza',
		'description': 'Yummy, pizza!',
		'usedMessage': '🍕 | You ate delicious pizza!',
		'ids': [
			'pz',
		],
		'sale': true,
		'price': 10,
		'usable': true,
	},
	{
		'name': 'apple',
		'description': 'An apple a day keeps the doctor away!',
		'usedMessage': '🍎 | You ate a delicious apple.',
		'ids': [
			'pz',
		],
		'sale': true,
		'price': 5,
		'usable': true,
	},
	{
		'name': 'topmedal',
		'description': 'Why would you even buy this.',
		'ids': [
			'medal',
		],
		'sale': true,
		'price': 10000000,
		'usable': false,
	},
];

new Command({
	name: 'economy',
	description: 'economy subcommand',
	type: [CommandType.SLASH],
	inhibitors: [
		new VoteInhibitor({
			message: 'You must be vote me if you want to use this command ⬎\nhttps://top.gg/bot/849663572308918343/vote',
		}),
	],
	arguments: [
		new Argument({
			name: 'addmoney',
			description: 'give money to members or yourself',
			type: ArgumentType.SUB_COMMAND,
			arguments: [
				new Argument({
					name: 'money',
					description: 'money size',
					type: ArgumentType.NUMBER,
					required: true,
				}),
				new Argument({
					name: 'user',
					description: 'choose member if u want',
					type: ArgumentType.USER,
				}),
			],
		}),
		new Argument({
			name: 'balance',
			description: 'see your balance',
			type: ArgumentType.SUB_COMMAND,
			arguments: [
				new Argument({
					name: 'user',
					description: 'choose member if u want',
					type: ArgumentType.USER,
				}),
			],
		}),
		/* new Argument({
			name: "leaderboard",
			description: "see the leaderboard",
			type: ArgumentType.SUB_COMMAND
		}),*/
		new Argument({
			name: 'pay',
			description: 'pay something to member',
			type: ArgumentType.SUB_COMMAND,
			arguments: [
				new Argument({
					name: 'money',
					description: 'money size',
					type: ArgumentType.NUMBER,
					required: true,
				}),
				new Argument({
					name: 'user',
					description: 'choose member for pay',
					type: ArgumentType.USER,
					required: true,
				}),
			],
		}),
		new Argument({
			name: 'removemoney',
			description: 'take money from members or yourself',
			type: ArgumentType.SUB_COMMAND,
			arguments: [
				new Argument({
					name: 'money',
					description: 'money size',
					type: ArgumentType.NUMBER,
					required: true,
				}),
				new Argument({
					name: 'user',
					description: 'choose member if u want',
					type: ArgumentType.USER,
				}),
			],
		}),
		new Argument({
			name: 'work',
			description: 'work and earn random money',
			type: ArgumentType.SUB_COMMAND,
		}),
	],
	async run({ arguments, reply, member }) {
		const sub = arguments.getSubcommand();

		if (sub === 'addmoney') {
			const m = arguments.getNumber('money');
			const a = arguments.getMember('user') || member;
    	Schema.findOne({ Member: a.id }, async (err, data) => {
      	if (data) {
					const b = data.Balance + m;
        	data.Balance = b;
        	data.save();
      	}
				else {
        	new Schema({
          	Member: member.id,
          	Balance: m,
        	}).save();
      	}

				return reply({ content: arguments.getMember('user') ? `You add ${m}$ to ${arguments.getMember('user')}'s balance` : `You add ${m}$ to your balance`, ephemeral: true });
    	});
		}

		if (sub === 'balance') {
			const a = arguments.getMember('user') || member;
    	Schema.findOne({ Member: a.id }, async (err, data) => {
      	if (data) {
        	return reply({ content: arguments.getMember('user') ? `${arguments.getMember('user').user.username} have ${data.Balance}$` : `You have ${data.Balance}$`, ephemeral: true });
      	}
				else {
        	return reply({ content: arguments.getMember('user') ? `${arguments.getMember('user').user.username} dont have any cash` : 'You dont have any cash' });
      	}
    	});
		}

		/* if (sub === 'leaderboard') {
			let c = Schema.find();

			let e = new EmbedBuilder()
				.setTitle("Leaderboard")
				.setDescription(c.slice(0, 10).filter(a => a.Balance > 0).map((b, i) => `\`${i++})\` ${client.users.cache.get(b.uid)?.tag || "Unknown#0000"} - **${b.Balance}$**`).join("\n\n"))

			return reply({ embeds: [e] })
		}*/

		if (sub === 'pay') {
			const m = arguments.getNumber('money');
			const a = arguments.getMember('user');
    	Schema.findOne({ Member: member.id }, async (err, data) => {
      	if (data) {
					if (data.Balance <= m) return reply({ content: 'You dont have enough cash' });
					const b = data.Balance - m;
        	data.Balance = b;
        	data.save();
      	}
				else {
        	return reply({ content: 'You cant send the money because you dont have any cash', ephemeral: true });
      	}

				return reply({ content: `You send ${m}$ to ${a.user.username}` });
    	});
			Schema.findOne({ Member: a.id }, async (err, data) => {
      	if (data) {
					const b = data.Balance + m;
        	data.Balance = b;
        	data.save();
      	}
				else {
        	new Schema({
          	Member: a.id,
          	Balance: m,
        	}).save();
      	}
    	});
		}

		if (sub === 'removemoney') {
			const m = arguments.getNumber('money');
			const a = arguments.getMember('user') || member;
    	Schema.findOne({ Member: a.id }, async (err, data) => {
				if (m >= data.Balance) return reply({ content: `${a.user.username} dont have enough cash` });
      	if (data) {
					const b = data.Balance - m;
        	data.Balance = b;
        	data.save();
      	}
				else {
        	return reply({ content: `${a.user.username}'s doesn't have any cash` });
      	}

				return reply({ content: arguments.getMember('user') ? `You remove ${m}$ to ${arguments.getMember('user')}'s balance` : `You remove ${m}$ to your balance`, ephemeral: true });
    	});
		}

		if (sub === 'work') {
    	Schema.findOne({ Member: member.id }, async (err, data) => {
				const m = Math.floor(Math.random() * 5000);
      	if (data) {
					if (Date.now() < data.timelytime) return reply({ content: 'You just claimed your bonus, come back later', ephemeral: true });
					const b = data.Balance + m;
        	data.Balance = b;
					data.timelytime = Date.now() + 8.64e+7;
        	data.save();
      	}
				else {
        	new Schema({
          	Member: member.id,
          	Balance: m,
        	}).save();
      	}
				return reply({ content: `You earned ${m}$ now you have ${data.Balance}$` });
    	});
		}
	},
});