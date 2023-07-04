const mongoose = require('mongoose');

const EconomySchema = new mongoose.Schema({
	Member: { type: String, unique: true },
	Balance: { type: Number, default: 100000 },
	timelytime: { type: Number },
});

module.exports = mongoose.model('economy', EconomySchema);