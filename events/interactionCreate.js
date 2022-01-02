const fs = require('fs');

const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		if (interaction.isCommand())
			for (file of commandFiles) {
				if (file.substring(0, file.length - 3) == interaction.commandName) {
					const command = require(__dirname + `/../commands/${file}`);
					command.execute(interaction);
				}
			}
		if (interaction.isButton()) {
			let interactionId = interaction.customId;
			let type = interactionId.split('-')[0];
			let buttonID = interactionId.split('-')[1];
			const buttonFiles = fs
				.readdirSync(`./buttons/${type}`)
				.filter((file) => file.endsWith('.js'));

			for (file of buttonFiles) {
				if (file.substring(0, file.length - 3) == buttonID) {
					const button = require(__dirname + `/../buttons/${type}/${file}`);
					button.execute(interaction);
				}
			}
		}
	},
};
