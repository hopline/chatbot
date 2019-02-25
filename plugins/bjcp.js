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
                        let detail = false;
                        let msg = "";
                        if(message.content.indexOf('!bjcp_detail') == 0) {
                                msg = message.content.substring ('!bjcp_detail '.length).toUpperCase();
                                detail = true;
                        } else {
                                msg = message.content.substring ('!bjcp '.length).toUpperCase();
                        }
                        let msgsplit = msg.split(' ');
                        let replied = false;
                        let beerapprox = "";
                        for(let i = 0; i < this.bjcp[0].category.length; i++) {
                                for(let j = 0; j < this.bjcp[0].category[i].subcategory.length; j++) {
                                        let beer = this.bjcp[0].category[i].subcategory[j];
                                        if(msg.localeCompare(beer.name[0].toUpperCase()) == 0) {
                                                replied = true;
                                                let reply = beer.name+" ("+beer.$.id+") : IBU "+beer.stats[0].ibu[0].low+"-"+beer.stats[0].ibu[0].high;
                                                reply += ", OG "+beer.stats[0].og[0].low+"-"+beer.stats[0].og[0].high;
                                                reply += ", FG "+beer.stats[0].fg[0].low+"-"+beer.stats[0].fg[0].high;
                                                reply += ", SRM "+beer.stats[0].srm[0].low+"-"+beer.stats[0].srm[0].high;
                                                reply += ", Volts "+beer.stats[0].abv[0].low+"-"+beer.stats[0].abv[0].high;
                                                reply += "\nExemples: "+beer.examples[0];
                                                message.reply(reply);
                                                if(detail) {
                                                        reply = beer.aroma[0]+"\n"+beer.appearance[0]+"\n"+beer.flavor[0]+"\n"+beer.mouthfeel[0];

                                                        message.author.createDM().then((channel) => {
                                                                return channel.send(reply);
                                                        });

                                                        reply = beer.impression[0]+"\n"+beer.history[0]+"\n"+beer.ingredients[0]+"\n"+beer.comparison[0];
                                                        message.author.createDM().then((channel) => {
                                                                return channel.send(reply);
                                                        });

                                                }

                                                break;
                                        } else {
                                                for(var k = 0; k < msgsplit.length; k++) {
                                                        if(beer.name[0].toUpperCase().indexOf(msgsplit[k]) >= 0) {
                                                                if(beerapprox.length > 0)
                                                                        beerapprox+= ", ";
                                                                beerapprox += beer.name[0];
                                                        }

                                                }
                                        }
                                }
                                if(replied)
                                        break;

			}
			if(!replied) {
				if(beerapprox.length > 0) {
					message.reply("Chépo, tu parles de quoi ? "+beerapprox+" ?");
				} else {
					message.reply("Apatrouvé !");
				}
			}

		}
	}

}
module.exports = new Bjcp(); 
