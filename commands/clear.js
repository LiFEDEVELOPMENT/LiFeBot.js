const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription(
			'Entfernt eine angegebene Anzahl an Nachrichten im aktuellen Channel'
		)
		.addNumberOption((option) =>
			option
				.setName('amount')
				.setDescription('Die Anzahl an Nachrichten, die du entfernen möchtest')
				.setRequired(true)
		),
	async execute(interaction) {
		// Deletes the given amount of messages and replys with a confirmation
		interaction.channel
			.bulkDelete(interaction.options.getNumber('amount'))
			.catch((err) => {
				console.err(err);
			});
		interaction.reply(
			`Es wurden ${interaction.options.getNumber(
				'amount'
			)} Nachricht(en) gelöscht.`,
			true
		);
	},
};
