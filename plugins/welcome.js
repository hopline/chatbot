class Welcome {

	initialize(discord) {
		discord.on('guildMemberAdd', this.onGuildMemberAdd);
	}

	onGuildMemberAdd(member) {
		member.createDM().then((channel) => {
			const config = require('../config.json');
			return channel.send(config.plugins.welcome.message);
		});
	}

}
module.exports = new Welcome(); 