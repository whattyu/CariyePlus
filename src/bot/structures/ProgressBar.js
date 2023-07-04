class ProgressBar {
	constructor(num, cap, client, useCustomEmojis = false) {
		this.bits = [];
		this.cap = cap;
		this.num = num;
		this.client = client;

		this.useCustomEmojis = useCustomEmojis;

		const add = 1 / cap;
		for (let i = 0; i < cap; i++) {
			if (num >= add * (i + 1)) this.bits.push(1);
			else if (num >= (add * (i + 1)) - add / 2) this.bits.push(0.5);
			else this.bits.push(0);
		}

		return this;
	}

	_make(map, customMap, t) {
		const f = [];
		for (let i = 0; i < this.cap; i++) {
			if (this.useCustomEmojis && t === 'dc') {
				const name = [...customMap[this.bits[i]]];
				if (name[0] && i === 0) name[1] += 'Start';
				if (name[0] && (i === this.cap - 1 || this.bits[i + 1] === 0 && this.bits[i] !== 0)) name[1] += 'End';

				f.push(this.client.emojis.cache.find(n => n.name === name[1]));
			}
			else {
				const axd = map[this.bits[i]];
				f.push(axd);
			}
		}
		return f.join('');
	}

	toBits() {
		return this.bits;
	}

	toUnicode() {
		return this._make({
			0: '□',
			0.5: '◩',
			1: '■',
		});
	}

	toEmoji() {
		return this._make({
			0: ':black_medium_square:',
			0.5: '<:blue_black_square:942410561826734100>',
			1: ':blue_square:',
		}, {
			0: [false, 'empty'],
			0.5: [true, 'blueblack'],
			1: [true, 'blurplefull'],
		}, 'dc');
	}
}

module.exports = ProgressBar;