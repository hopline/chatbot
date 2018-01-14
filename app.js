/**
 * Init
 */
const Discord = require('discord.js');
const config = require('./config.json');

const bot = new Discord.Client();

/**
 * Events
 */
bot.on('message', function(message) {
    // !roll
    if(message.content.indexOf('!roll') == 0) {
        var strDice = message.content.replace('!roll ', '');

        if(strDice.length > 2 && strDice.indexOf('d') > 0) {
            var dice = strDice.split('d');

            var result = '';
            var strResult = '';

            if(parseInt(dice[1]) && parseInt(dice[1]) < 101 && parseInt(dice[0]) < 11) {
                for(i=0; i<parseInt(dice[0]); i++) {
                    result += (result.length == 0) ? '' : ', ';
                    result += Math.floor(Math.random() * parseInt(dice[1])) + 1;
                }

                strResult += (parseInt(dice[0]) < 2) ? 'Ton résultat pour ' : 'Tes résultats pour ';
                strResult += strDice;
                strResult += (parseInt(dice[0]) < 2) ? ' est : ' : ' sont : ';
                strResult += result;

                message.reply(strResult);
            }
        }
    }
});

/**
 * Login
 */
bot.login(config.token);