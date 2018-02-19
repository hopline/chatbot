/**
 * Init
 */
const config = require('./config.json');
const _ = require('lodash');

const discord = require('discord.js');
const bot = new discord.Client();

const plugins = {};
_.forEach(config.plugins, (plugin, name) => {
	plugins[name] = require('./plugins/' + name + '.js');
	plugins[name].initialize(bot);
});

/**
 * Login
 */
bot.login(config.token);
