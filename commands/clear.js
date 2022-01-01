const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription(
			'Löscht die angegebene Anzahl an Nachrichten im aktuellen Channel!'
		)
		.addNumberOption((option) =>
			option
				.setName('amount')
				.setDescription('Die Anzahl an Nachrichten, die du entfernen möchtest')
				.setRequired(true)
		),
	async execute(interaction) {
		const amount = interaction.options.getNumber('amount');

		// Deletes the given amount of messages
		interaction.channel.bulkDelete(amount).catch((err) => {
			console.err(err);
		});

		interaction.reply({
			content: `Es wurden ${amount} Nachricht(en) gelöscht.`,
			empheral: true,
		});
	},
};
