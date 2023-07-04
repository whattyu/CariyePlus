const { Inhibitor } = require('gcommands');

class OwnerOnlyInhibitor extends Inhibitor.Inhibitor {
	constructor(options) {
		super(options);

		this.ownerIds = ['496328012741214208', '918527458582622238', '947895920308146289'];
	}

	run(ctx) {
		if (!this.ownerIds.includes(ctx.userId)) return ctx.reply(this.resolveMessage(ctx) || 'You can not use this command');
		else return true;
	}
}

module.exports = OwnerOnlyInhibitor;