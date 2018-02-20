const config = require('../config.json');

class LogMySQL {
	initialize(discord) {
		const db = require('mysql2');
		this.connection = db.createConnection({
			host: config.mysql.host,
			user: config.mysql.user,
			password: config.mysql.password,
			database: config.mysql.database
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

		let sql = 'INSERT INTO discord_messages (discord_id, discord_author_id, discord_author_username, discord_channel_id, discord_channel_name, discord_content, created_at, updated_at) ';
		sql += 'VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
			
		let fields = [message.id, message.author.id, message.author.username, message.channel.id, message.channel.name, cleanMessage, datetime, datetime];

		this.connection.execute(
			sql,
			fields,
			function(err, results, fields) {
				console.log(err);
			}
		);
	}

}

module.exports = new LogMySQL(); 
