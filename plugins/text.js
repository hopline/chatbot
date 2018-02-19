
class Text {

	initialize(discord) {
		discord.on('message', (message) => this.onMessage(message))
	}

	onMessage(message) {
		if(message.type !== 'DEFAULT' || message.channel.type !== 'text')
			return;

		const _ = require('lodash');
		const config = require('../config.json');

		let commands = config.plugins.text.commands;

		_.forEach(commands, (text, name) => {
			if(message.content.indexOf('!' + name) !== 0)
				return;
	
			message.reply(text);

		});
	}

}
module.exports = new Text(); 