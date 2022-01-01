const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shutdown')
		.setDescription('Fährt den Bot herunter!'),
	async execute(interaction) {
		await interaction.reply('Der Bot wird heruntergefahren!');
		interaction.client.destroy();
	},
};
