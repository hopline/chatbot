/**
 * Init
 */
const discord = require('discord.js');
const config = require('./config.json');
const db = require('mysql2');
const es = require('elasticsearch');
const http = require('http');
const S = require('string');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const bot = new discord.Client();
const ba = require('beeradvocate-api');

const connDB = null;
if(config.mysql.enabled) {
	const connDB = db.createConnection({
		host: config.mysql.host,
		user: config.mysql.user,
		password: config.mysql.password,
		database: config.mysql.database
	});
}
if(config.elasticsearch.enabled) {
	const connES = new es.Client({
		host: config.elasticsearch.host,
		log: config.elasticsearch.log
	});
}

var fs = require('fs'), xml2js = require('xml2js');
var parser = new xml2js.Parser();
let bjcp = [];
fs.readFile('./bjcp.xml', function(err, data) {
	    parser.parseString(data, function (err, result) {
	bjcp.push(result.styleguide.class[0]);
    });
});
/**
 * Events
 */
bot.on('message', function(message) {

	if(message.type == 'DEFAULT' && message.channel.type == 'text') {
		// !roll
		if(message.content.indexOf('!roll') == 0) {
			var strDice = message.content.replace('!roll ', '');

			if(strDice.length > 2 && strDice.indexOf('d') > 0) {
				var dice = strDice.split('d');

				if(parseInt(dice[1]) && parseInt(dice[1]) < 101 && parseInt(dice[0]) < 11) {
					var result = '';
					var strResult = '';

					for(i=0; i<parseInt(dice[0]); i++) {
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
		else if(message.content.indexOf('!apero') == 0 || message.content.indexOf('!apéro') == 0) {
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
		} else if (message.content.indexOf('!bière') == 0 || message.content.indexOf('!biere') == 0) { 
			ba.beerSearch(message.content.substring ('!biere '.length), function(beers) {
				console.log(beers);
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
						//						//			
						//							ba.beerPage(currBeer.beer_url, function(beer){
						//								var arrBeer = JSON.parse(beer);
						//								console.log(arrBeer);
						//								varBeer += currBeer.beer_name + " ("+currBeer.brewery_name+") : [http://beeradvocate.com"+currBeer.beer_url+"], ["+beer.beer_style+", "+beer.beer_abv+", "+beer.ba_score+"]"
					}
				}
				message.reply(strBeers);
			});
		} 
		else if(message.content.indexOf('!bazoo') == 0) {
			message.reply('Connard.');
		}
		else if(message.content.indexOf('!gamb') == 0) {
			message.reply('Vive l\'Alsace.');
		}
		else if(message.content.indexOf('!alks') == 0) {
			message.reply(':candy:.');
		}
		else if(message.content.indexOf('!arkpéro') == 0) {
			message.reply('Il est toujours l\'heure de l\'arkpéro.');
		}
		else if(message.content.indexOf('!apuglouglou') == 0) {
			message.reply('Très cher, je te conseille de lire ceci : http://univers-biere.net/pbcourants.php ou à défaut si t\'enquérir de solutions te paraît trop long, de taper !bazoo');
		}
		else if(message.content.indexOf('!café') == 0) {
			message.reply(':coffee:. Tu veux pas une bière plutôt ? :beer:');
		}
		else if(message.content.indexOf('!plato2sg') == 0) {
			var strDeg = message.content.replace('!plato2sg ', '');
			if(parseInt(strDeg)) {
				var deg = parseFloat(strDeg);
				message.reply(Math.ceil((1+(deg / (258.6 - ( (deg/258.2) *227.1) ) ))*1000)/1000);
			}
		} 
		else if(message.content.indexOf('!brix2sg') == 0) {
			var strDeg = message.content.replace('!brix2sg ', '');
			if(parseInt(strDeg)) {
				var deg = parseFloat(strDeg);
				message.reply(Math.ceil(((deg / (258.6-((deg / 258.2)*227.1))) + 1)*1000)/1000);
			}
		} else if(message.content.indexOf('!fermbrix2sg') == 0) {
			var strDeg = message.content.replace('!fermbrix2sg ', '');
			var degs = strDeg.split(' ');
			if(degs.length == 2 && parseInt(degs[0]) && parseInt(degs[1])) {
				orig = parseFloat(degs[0]);
				current = parseFloat(degs[1]);
				f= 1.001843-0.002318474*(orig)-0.000007775*(current*orig)-0.000000034*(orig*orig*orig)+0.00574*(current) +0.00003344*(current*current)+0.000000086*(current*current*current)
				g=(Math.round(f*1000)/1000)
				message.reply(g);
			}
		} else if(message.content.indexOf('!bjcp') == 0) {
			var msg = message.content.substring ('!bjcp '.length).toUpperCase();
			replied = false;
			for(var i = 0; i < bjcp[0].category.length; i++) {
				for(var j = 0; j < bjcp[0].category[i].subcategory.length; j++) {
					var beer = bjcp[0].category[i].subcategory[j];
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

		} else if(message.content.indexOf('!help') == 0) {
			message.author.createDM().then(function(channel) {
				var message = 'Petite liste non exhaustive\n';
				message += 'Pour les douceurs : !roll XdY !café, !bière nomdelabière, !apéro, !arkpéro, !bazoo, !gamb, !alks\n';
				message += 'Pour les sérieux : !plato2sg degrésplato, !brix2sg degrésbrix, !fermbrix2sg brixoriginal brixactuel\n';
				message += 'Pour apprendre : !apuglouglou';

				return channel.send(message);
			});

		}//fin if !commands

		// convertion des emojis unicode ($&)
		var ranges = [
			'\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
			'\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
			'\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
		];

		var cleanMessage = message.content.replace(
			new RegExp(ranges.join('|'), 'g'),
			'<span class="emoji" data-emoji="$&"></span>');

		// logs
		// by mysql
		if(config.mysql.enabled) {
			var today = new Date();
			var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
			var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			var datetime = date + ' ' + time;

			var sql = 'INSERT INTO discord_messages (discord_id, discord_author_id, discord_author_username, discord_channel_id, discord_channel_name, discord_content, created_at, updated_at) ';
			sql += 'VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

			var fields = [message.id, message.author.id, message.author.username, message.channel.id, message.channel.name, cleanMessage, datetime, datetime];

			connDB.execute(
				sql,
				fields,
				function(err, results, fields) {
					console.log(err);
				}
			);
		}

		if(config.elasticsearch.enabled) {

			// by elasticsearch
			connES.create({
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
});

bot.on('guildMemberAdd', function(member) {
	member.createDM().then(function(channel) {
		var message = 'Bienvenue sur la Hopline ! ';
		message += 'Pour que tout se passe bien lis attentivement : http://hopline.fr/bienvenue ! ';
		message += 'Comme pour tout, il est interdit de parler de choses illégales, ';
		message += 'l\'alcool est à consommer avec modération et il est nécessaire d\'avoir l\'âge légal pour consommer de l\'alcool ';
		message += '(un petit lien dans ta signature incitant les gens à nous rejoindre est un gros plus pour la communauté)';

		return channel.send(message);
	});
});

/**
 * Login
 */
bot.login(config.token);
