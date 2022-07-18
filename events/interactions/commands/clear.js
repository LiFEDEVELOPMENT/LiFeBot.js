import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import lang from '#util/Lang';
import errorMessage from '#errormessage';

const create = () => {
	const command = new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Deletes any amout of messages from this channel')
		.addNumberOption((option) =>
			option
				.setName('amount')
				.setDescription('The amount of messages you want to delete')
				.setRequired(true)
		)
		.setDMPermission(false);

	return command.toJSON();
};

const execute = async (interaction) => {
	try {
		const locale = interaction.locale;
		const amount = interaction.options.getNumber('amount');

		// Check if the user is allowed to delete messages
		if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages))
			return interaction.reply({
				content: lang('CLEAR_EXECUTE_ERROR_PERMISSION', locale),
				ephemeral: true,
			});

		// Check if the amount parameter is < 1
		if (amount < 1)
			return interaction.reply({
				content: lang('CLEAR_EXECUTE_ERROR_PARAMETER', locale),
				ephemeral: true,
			});

		// Deletes the given amount of messages and tracks the real amount of messages deleted
		const deletedMessages = (await interaction.channel.bulkDelete(amount, true))
			.size;

		// Reply with a confirmation and include a notice about Discord's API limit if some messages weren't deleted
		interaction.reply({
			content:
				lang('CLEAR_EXECUTE_SUCCESS', locale, { AMOUNT: deletedMessages }) +
				(amount > deletedMessages
					? lang('CLEAR_EXECUTE_API_LIMIT', locale)
					: ''),
			ephemeral: true,
		});
	} catch (error) {
		errorMessage(interaction, error);
	}
};

export { create, execute };
