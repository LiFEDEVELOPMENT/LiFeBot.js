import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions } from 'discord.js';
import lang from '#lang';

async function create() {
	const command = new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Deletes any amout of messages from this channel')
		.addNumberOption((option) =>
			option
				.setName('amount')
				.setDescription('The amount of messages you want to delete')
				.setRequired(true)
		);

	return command.toJSON();
}
async function execute(interaction) {
	const locale = interaction.locale;
	try {
		const amount = interaction.options.getNumber('amount');

		// Check if the user is allowed to delete messages
		if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
			return interaction.reply({
				content: await lang('CLEAR_EXECUTE_ERROR_PERMISSION', {}, locale),
				ephemeral: true,
			});

		// Check if the amount parameter is < 1
		if (amount < 1)
			return interaction.reply({
				content: await lang('CLEAR_EXECUTE_ERROR_PARAMETER', {}, locale),
				ephemeral: true,
			});

		// Deletes the given amount of messages and tracks the real amount of messages deleted
		const deletedMessages = (await interaction.channel.bulkDelete(amount, true))
			.size;

		// Reply with a confirmation and include a notice about Discord's API limit if some messages weren't deleted
		interaction.reply({
			content:
				(await lang(
					'CLEAR_EXECUTE_SUCCESS',
					{ AMOUNT: deletedMessages },
					locale
				)) +
				(amount > deletedMessages
					? await lang('CLEAR_EXECUTE_API_LIMIT', {}, locale)
					: ''),
			ephemeral: true,
		});
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR', {}, locale),
			ephemeral: true,
		});
	}
}

export { create, execute };
