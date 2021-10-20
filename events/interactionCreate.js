const fs = require('fs');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		for(file of commandFiles) {
			if(file.substring(0, (file.length-3)) == interaction.commandName) {
			const command = require(__dirname + `/../commands/${file}`);
			command.execute(interaction);
			}
		}
	},
};