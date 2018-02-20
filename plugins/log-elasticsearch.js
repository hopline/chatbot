const config = require('../config.json');

class LogElasticSearch {

	initialize(discord) {
		const es = require('elasticsearch');
		this.connection = new es.Client({
			host: config.elasticsearch.host,
			log: config.elasticsearch.log
		});

		discord.on('message', (message) => this.onMessage(message))
	}

	onMessage(message) {
		if(message.type !== 'DEFAULT' || message.channel.type !== 'text')
			return;
			
		let today = new Date();
		let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		let datetime = date + ' ' + time;

		this.connection.create({
				index: 'hopline',
				type: 'discord_messages',
				id: 'dm' + message.id,
				body: {
					discord_author_id: message.author.id,
					discord_author_username: message.author.username,
					discord_channel_id: message.channel.id,
					discord_channel_name: message.channel.name,
					discord_content: cleanMessage,
					created_at: datetime,
					updated_at: datetime
				}
			}, function(error, response) {
			}
		);
	}

}

module.exports = new LogElasticSearch(); 