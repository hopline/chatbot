const config = require('../config.json');

class Roll {

	initialize(discord) {
		discord.on('message', (message) => this.onMessage(message))
	}

	onMessage(message) {
		if(message.type !== 'DEFAULT' || message.channel.type !== 'text')
			return;
			
		if(message.content.indexOf('!roll') == 0) {
			let strDice = message.content.replace('!roll ', '');

			if(strDice.length > 2 && strDice.indexOf('d') > 0) {
				let dice = strDice.split('d');

				if(parseInt(dice[1]) && parseInt(dice[1]) < 101 && parseInt(dice[0]) < 11) {
					let result = '';
					let strResult = '';

					for(let i=0; i<parseInt(dice[0]); i++) {
						result += (result.length == 0) ? '' : ', ';
						result += Math.floor(Math.random() * parseInt(dice[1])) + 1;
					}

					strResult += (parseInt(dice[0]) < 2) ? 'ton résultat pour ' : 'tes résultats pour ';
					strResult += strDice;
					strResult += (parseInt(dice[0]) < 2) ? ' est : ' : ' sont : ';
					strResult += result;

					message.reply(strResult);
				}
			}
		} 
	}

}
module.exports = new Roll(); 