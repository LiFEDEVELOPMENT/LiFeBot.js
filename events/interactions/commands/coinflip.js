const { SlashCommandBuilder } = require('@discordjs/builders');
const lang = require('@lang');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription(await lang.getString('COINFLIP_COMMAND_DESCRIPTION')),
	async execute(interaction) {
		const guildid = interaction.guild.id;
		// Replys with "Kopf" or "Zahl" with a chance of 50%
		await interaction.reply(
			Math.random() < 0.5
				? await lang.getString('HEADS', {}, guildid)
				: await lang.getString('TAILS', {}, guildid)
		);
	},
};
