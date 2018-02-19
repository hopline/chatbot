class Bjcp {

	initialize(discord) {
		this.bjcp = [];
		let fs = require('fs'), xml2js = require('xml2js');
		let parser = new xml2js.Parser();
		fs.readFile('bjcp.xml', (err, data) => {
			parser.parseString(data, (err, result) => {
				this.bjcp.push(result.styleguide.class[0]);
			});
		});
		discord.on('message', (message) => this.onMessage(message))
	}

	onMessage(message) {
		if(message.type !== 'DEFAULT' || message.channel.type !== 'text')
			return;

		if(message.content.indexOf('!bjcp') == 0) {
			let msg = message.content.substring ('!bjcp '.length).toUpperCase();
			let replied = false;
			for(let i = 0; i < this.bjcp[0].category.length; i++) {
				for(let j = 0; j < this.bjcp[0].category[i].subcategory.length; j++) {
					let beer = this.bjcp[0].category[i].subcategory[j];
					if(msg.localeCompare(beer.name[0].toUpperCase()) == 0) {
						replied = true;
						reply = beer.name+" ("+beer.$.id+") : IBU "+beer.stats[0].ibu[0].low+"-"+beer.stats[0].ibu[0].high;
						reply += ", OG "+beer.stats[0].og[0].low+"-"+beer.stats[0].og[0].high;
						reply += ", FG "+beer.stats[0].fg[0].low+"-"+beer.stats[0].fg[0].high;
						reply += ", SRM "+beer.stats[0].srm[0].low+"-"+beer.stats[0].srm[0].high;
						reply += ", Volts "+beer.stats[0].abv[0].low+"-"+beer.stats[0].abv[0].high;
						reply += "\nExemples: "+beer.examples[0];
						message.reply(reply);
						break;
					}
				}
				if(replied)
					break;
			}
			if(!replied)
				message.reply("Apatrouvé !");

		}
	}

}
module.exports = new Bjcp(); 