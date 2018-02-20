const config = require('../config.json');

class Apero {

	initialize(discord) {
		discord.on('message', (message) => this.onMessage(message))
	}

	onMessage(message) {
		if(message.type !== 'DEFAULT' || message.channel.type !== 'text')
			return;
			
		if(message.content.indexOf('!apero') == 0 || message.content.indexOf('!apéro') == 0) {
			const http = require('http');
			const S = require('string');
			const Entities = require('html-entities').AllHtmlEntities;
			const entities = new Entities();
			const options = {
				hostname: 'estcequecestbientotlapero.fr',
				port: 80,
				path: '',
				method: 'GET'
			}
			var rePattern = new RegExp(/.*<h2>([\s\S]*)<\/h2>.*/);
			let strApero = "T'es bien pressé toi";
			const req = http.request(options, (res) => {
				res.setEncoding('utf8');
				let content= "";
				res.on('data', (chunk) => {
					content += chunk;
				});
				res.on('end', () => {
					var arrMatches = content.match(rePattern);
					strApero = S(arrMatches[0]).stripTags().s;
					strApero = entities.decode(strApero.trim().replace(/(<([^>]+)>)/ig,""));
					message.reply(strApero);
				});
			});
			req.end();
		}
	}

}

module.exports = new Apero(); 