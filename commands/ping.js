const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Antwortet mit Pong!'),
	async execute(interaction) {
		// Replies with "Pong!"
		await interaction.reply('Pong!');
	},
};