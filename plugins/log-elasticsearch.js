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
			
			// convertion des emojis unicode ($&)
		var ranges = [
			'\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
			'\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
			'\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
		];

		var cleanMessage = message.content.replace(
			new RegExp(ranges.join('|'), 'g'),
			'<span class="emoji" data-emoji="$&"></span>');
	
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
