const { Inhibitor } = require('gcommands');

class AdminInhibitor extends Inhibitor.Inhibitor {
	constructor(options) {
		super(options);

		this.permissions = ['Administrator'];
	}

	run(ctx) {
		if (!ctx.inGuild()) return;
		if (!ctx.memberPermissions.has(this.permissions)) {
			return ctx.reply({
				content:
					this.resolveMessage(ctx) ||
					`You need the following permissions to execute this command: ${this.permissions
						.join(', ')
						.replace(/_/g, ' ')
						.toLowerCase()}`,
				ephemeral: this.ephemeral,
			});
		}
		else { return true; }
	}
}

module.exports = AdminInhibitor;