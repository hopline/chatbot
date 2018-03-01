var cleverbot = require("cleverbot.io"),
	config = require('../config.json'),
	discord = require('discord.js');


class Cleverbot {

	initialize(discord) {
		this.discord = discord;
		this.bot = new cleverbot(config.plugins.cleverbot.id,
			config.plugins.cleverbot.key);
		
		discord.on('message', (message) => this.onMessage(message));
	}

	onMessage(message) {
		if(message.type !== 'DEFAULT' || message.channel.type !== 'text')
			return;

		if (!message.isMentioned(this.discord.user))
			return;

		this.bot.setNick(this.discord.user.username); 
		this.bot.create((err, session) => {
			this.bot.ask(message.content, (err, response) => {
				message.reply(response);
			 });
		});
	}

}
module.exports = new Cleverbot(); 