/**
 * Init
 */
const discord = require('discord.js');
const config = require('./config.json');
const db = require('mysql2');
const es = require('elasticsearch');

const bot = new discord.Client();
const connDB = db.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
const connES = new es.Client({
    host: config.elasticsearch.host,
    log: config.elasticsearch.log
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
         } // fin  if !roll

         // logs
         // by mysql
         var today = new Date();
         var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
         var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
         var datetime = date + ' ' + time;

         var sql = 'INSERT INTO discord_messages (discord_id, discord_author_id, discord_author_username, discord_channel_id, discord_channel_name, discord_content, created_at, updated_at) ';
             sql += 'VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

         var fields = [message.id, message.author.id, message.author.username, message.channel.id, message.channel.name, String(message.content.replace(/[^\x00-\x7F]/g, "")), datetime, datetime];

         connDB.execute(
            sql,
            fields,
            function(err, results, fields) {

            }
         );

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
                discord_content: message.content.replace(/[^\x00-\x7F]/g, ""),
                created_at: datetime,
                updated_at: datetime
            }
            }, function(error, response) {

            }
         );
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