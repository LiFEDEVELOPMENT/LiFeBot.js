const { SlashCommandBuilder } = require('@discordjs/builders');
const lang = require('@lang');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription(await lang.getString('CLEAR_COMMAND_DESCRIPTION'))
		.addNumberOption((option) =>
			option
				.setName('amount')
				.setDescription(await lang.getString('CLEAR_AMOUNT_DESCRIPTION'))
				.setRequired(true)
		),
	async execute(interaction) {
		const guildid = interaction.guild.id;
		const amount = interaction.options.getNumber('amount');

		// Deletes the given amount of messages
		await interaction.channel.bulkDelete(amount).catch((err) => {
			console.err(err);
		});

		interaction.reply({
			content: await lang.getString(
				'CLEAR_SUCCESS',
				{ AMOUNT: amount },
				guildid
			),
			ephemeral: true,
		});
	},
};
