const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Replies with information about the server!'),
	async execute(interaction) {
		// Replies with information about the server including its name and member count
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	},
};