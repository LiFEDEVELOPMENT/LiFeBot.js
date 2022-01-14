import { SlashCommandBuilder } from '@discordjs/builders';
import lang from '#lang';

async function create() {
	const command = new SlashCommandBuilder()
		.setName('clear')
		.setDescription("Clears previous messages from your channel")
		.addNumberOption((option) =>
			option
				.setName('amount')
				.setDescription("Amount of messages you want to clear")
				.setRequired(true)
		);

	return command.toJSON();
}
async function execute() {
	try {
		const guildid = interaction.guild.id;
		const amount = interaction.options.getNumber('amount');

		// Deletes the given amount of messages
		await interaction.channel.bulkDelete(amount);

		interaction.reply({
			content: await lang('CLEAR_EXECUTE_SUCCESS', { AMOUNT: amount }, guildid),
			ephemeral: true,
		});
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR'),
			ephemeral: true,
		});
	}
}

export default { create, execute };
