const fs = require('fs');

const commandFiles = fs
	.readdirSync('./events/interactions/commands')
	.filter((file) => file.endsWith('.js'));

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		if (interaction.isCommand())
			for (file of commandFiles) {
				if (file.substring(0, file.length - 3) == interaction.commandName) {
					const command = require(`./interactions/commands/${file}`);
					command.execute(interaction);
				}
			}
		if (interaction.isButton()) {
			let interactionId = interaction.customId;
			let type = interactionId.split('-')[0];
			let buttonID = interactionId.split('-')[1];
			const buttonFiles = fs
				.readdirSync(`./events/interactions/buttons/${type}`)
				.filter((file) => file.endsWith('.js'));

			for (file of buttonFiles) {
				if (file.substring(0, file.length - 3) == buttonID) {
					const button = require(`./interactions/buttons/${type}/${file}`);
					if (type == 'polls')
						button.execute(interaction, interactionId.split('-')[2]);
					else button.execute(interaction);
				}
			}
		}
		if (interaction.isSelectMenu()) {
			let interactionId = interaction.customId;
			let type = interactionId.split('-')[0];
			let selectMenuId = interactionId.split('-')[1];
			const menuFiles = fs
				.readdirSync(`./events/interactions/menus/${type}`)
				.filter((file) => file.endsWith('.js'));
			for (file of menuFiles) {
				if (file.substring(0, file.length - 3) == selectMenuId) {
					const menu = require(`./interactions/menus/${type}/${file}`);
					if (type == 'polls')
						menu.execute(interaction, interactionId.split('-')[2]);
				}
			}
		}
	},
};
