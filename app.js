/**
 * Init
 */
const discord = require('discord.js');
const config = require('./config.json');
const _ = require('lodash');


const bot = new discord.Client();


const plugins = {};
_.forEach(config.plugins, (plugin, name) => {
	plugins[name] = require('./plugins/' + name + '.js');
	plugins[name].initialize(bot);
});

/**
 * Events
 */
bot.on('message', function(message) {

	if(message.type == 'DEFAULT' && message.channel.type == 'text') {

		// convertion des emojis unicode ($&)
		var ranges = [
			'\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
			'\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
			'\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
		];

		var cleanMessage = message.content.replace(
			new RegExp(ranges.join('|'), 'g'),
			'<span class="emoji" data-emoji="$&"></span>');

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
