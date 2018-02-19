
class Whisper {

	initialize(discord) {
		discord.on('message', (message) => this.onMessage(message))
		const config = require('../config.json');

	}

	onMessage(message) {
		if(message.type !== 'DEFAULT' || message.channel.type !== 'text')
			return;
		
		const config = require('../config.json');
		const _ = require('lodash');

		let commands = config.plugins.whisper.commands;

		_.forEach(commands, (text, name) => {
			if(message.content.indexOf('!' + name) !== 0)
				return;

			message.author.createDM().then((channel) => {
				return channel.send(text);
			});
		});
	}

}
module.exports = new Whisper(); 