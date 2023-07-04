const mongoose = require('mongoose');

const chatbotSchema = new mongoose.Schema({
	Guild: String,
	Channel: String,
});

module.exports = mongoose.model('chatbot-channel', chatbotSchema);