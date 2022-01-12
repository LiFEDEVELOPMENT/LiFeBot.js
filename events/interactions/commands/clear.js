import { SlashCommandBuilder } from '@discordjs/builders';
import lang from '@lang';

async function create() {
	new SlashCommandBuilder()
		.setName('clear')
		.setDescription(await lang('CLEAR_COMMAND_DESCRIPTION'))
		.addNumberOption((option) =>
			option
				.setName('amount')
				.setDescription(await lang('CLEAR_COMMAND_AMOUNT_DESCRIPTION'))
				.setRequired(true)
		);
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
		interaction.reply({
			content: await lang('ERROR'),
			ephemeral: true,
		});
	}
}

export default { create, execute };
