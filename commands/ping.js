const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		// Replies with "Pong!"
		await interaction.reply('Pong!');
	},
};