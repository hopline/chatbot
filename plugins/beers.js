class Beers {

	initialize(discord) {
		discord.on('message', (message) => this.onMessage(message))
	}

	onMessage(message) {
		if(message.type !== 'DEFAULT' || message.channel.type !== 'text')
			return;
			
		if (message.content.indexOf('!bière') == 0 || message.content.indexOf('!biere') == 0) { 
			const ba = require('beeradvocate-api');
			ba.beerSearch(message.content.substring ('!biere '.length), function(beers) {
				var arrBeers = JSON.parse(beers);
				var strBeers = "Apatrouvé !"
				if(arrBeers.length > 0) {
					strBeers = "";
					for (var i = 0; i < arrBeers.length; i++) {
						var currBeer = arrBeers[i];
						if(strBeers.length > 0)
							strBeers += "\r\n ";
						let strBeer =  currBeer.beer_name + " ("+currBeer.brewery_name+") : <http://beeradvocate.com"+currBeer.beer_url+">";
						strBeers += strBeer;
					}
				}
				message.reply(strBeers);
			});
		}
	}

}
module.exports = new Beers(); 