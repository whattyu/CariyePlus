/* eslint-disable no-shadow-restricted-names */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-mixed-spaces-and-tabs */
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const	figlet = require('figlet');
const	util = require('util');
const	figletAsync = util.promisify(figlet);
const zalgo = require('to-zalgo');

new Command({
	name: 'text',
	description: 'text commands | subcommand',
	type: [CommandType.SLASH],
	arguments: [
		new Argument({
			name: 'ascii',
			description: 'ascii command',
			type: ArgumentType.SUB_COMMAND,
  		arguments: [
    		new Argument({
      		name: 'text',
      		description: 'text',
      		type: ArgumentType.STRING,
      		required: true,
    		}),
  		],
		}),
		new Argument({
			name: 'emojify',
			description: 'convert your text to emojis',
			type: ArgumentType.SUB_COMMAND,
  		arguments: [
    		new Argument({
      		name: 'text',
      		description: 'text',
      		type: ArgumentType.STRING,
      		required: true,
    		}),
  		],
		}),
		new Argument({
			name: 'reverse',
			description: 'Reverses the given text',
			type: ArgumentType.SUB_COMMAND,
  		arguments: [
    		new Argument({
      		name: 'text',
      		description: 'text',
      		type: ArgumentType.STRING,
      		required: true,
    		}),
  		],
		}),
		new Argument({
			name: 'vaporwave',
			description: 'Transform your input to a string containing fixed-width characters',
			type: ArgumentType.SUB_COMMAND,
  		arguments: [
    		new Argument({
      		name: 'text',
      		description: 'text',
      		type: ArgumentType.STRING,
      		required: true,
    		}),
  		],
		}),
		new Argument({
			name: 'zalgo',
			description: 'Converts your text to Zalgo',
			type: ArgumentType.SUB_COMMAND,
  		arguments: [
    		new Argument({
      		name: 'text',
      		description: 'text',
      		type: ArgumentType.STRING,
      		required: true,
    		}),
  		],
		}),
	],
	run: async ({ arguments, reply }) => {
		const sub = arguments.getSubcommand();

		if (sub === 'ascii') {
			const text = arguments.getString('text');
    	const rendered = await figletAsync(text);
    	return reply({
      	content: '```AsciiDoc\n\n' + rendered + '\n\n```',
    	});
		}

		if (sub === 'emojify') {
			const text = arguments.getString('text');
    	let word = '';
    	function GetCharacter(input) {
      	if (('abcdefghijklmnopqrstuvwxyz').includes(input)) {
        	return ':regional_indicator_' + input + ':';
      	}
				else {
        	switch (input) {
          	case '0':
            	return ':zero:';
          	case '1':
            	return ':one:';
          	case '2':
            	return ':two:';
          	case '3':
            	return ':three:';
          	case '4':
            	return ':four:';
          	case '5':
            	return ':five:';
          	case '6':
            	return ':six:';
          	case '7':
            	return ':seven:';
          	case '8':
            	return ':eight:';
          	case '9':
            	return ':nine:';
          	case '!':
            	return ':grey_exclamation:';
          	case '<':
            	return ':arrow_backward:';
          	case '>':
            	return ':arrow_forward:';
          	case ',':
            	return ',';
          	case '.':
            	return '.';
          	case '@':
            	return '@';
          	case '?':
            	return ':question:';
          	default:
            	return ' ';
        	}
      	}
    	}
    	text.toLowerCase().split('').forEach(function(char) { word += char ? GetCharacter(char) : ' ';});
    	return reply({
      	content: word,
    	});
		}

		if (sub === 'reverse') {
			const text = arguments.getString('text');

			const Rarray = text.split('');
    	const reverseArray = Rarray.reverse();
    	const result = reverseArray.join('');

			return reply({
				content: result,
			});
		}

		if (sub === 'vaporwave') {
			const a = arguments.getString('text');

			function vaporiseText(string = '') {
				88;
      	string = string.split(' ').join('　');
      	return string
        	.split('')
        	.map((char) => {
          	const result = char.charCodeAt(0);

          	return result >= 33 && result <= 126
            	? String.fromCharCode(result - 33 + 65281)
            	: char;
        	})
        	.join('');
    	}

			return reply({
				content: vaporiseText(a),
			});
		}

		if (sub === 'zalgo') {
			const string = arguments.getString('text');

    	return reply({
      	content: zalgo(string),
    	});
		}
	},
});