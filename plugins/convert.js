class Convert {

	initialize(discord) {
		discord.on('message', (message) => this.onMessage(message))
	}

	onMessage(message) {
		if(message.type !== 'DEFAULT' || message.channel.type !== 'text')
			return;
			
		if(message.content.indexOf('!plato2sg') == 0) {
			let strDeg = message.content.replace('!plato2sg ', '');
			if(parseInt(strDeg)) {
				let deg = parseFloat(strDeg);
				message.reply(Math.ceil((1+(deg / (258.6 - ( (deg/258.2) *227.1) ) ))*1000)/1000);
			}
		} 
		else if(message.content.indexOf('!brix2sg') == 0) {
			let strDeg = message.content.replace('!brix2sg ', '');
			if(parseInt(strDeg)) {
				let deg = parseFloat(strDeg);
				message.reply(Math.ceil(((deg / (258.6-((deg / 258.2)*227.1))) + 1)*1000)/1000);
			}
		} else if(message.content.indexOf('!fermbrix2sg') == 0) {
			let strDeg = message.content.replace('!fermbrix2sg ', '');
			let degs = strDeg.split(' ');
			if(degs.length == 2 && parseInt(degs[0]) && parseInt(degs[1])) {
				let orig = parseFloat(degs[0]);
				let current = parseFloat(degs[1]);
				let f= 1.001843-0.002318474*(orig)-0.000007775*(current*orig)-0.000000034*(orig*orig*orig)+0.00574*(current) +0.00003344*(current*current)+0.000000086*(current*current*current)
				let g=(Math.round(f*1000)/1000)
				message.reply(g);
			}
		}
	}

}
module.exports = new Convert(); 