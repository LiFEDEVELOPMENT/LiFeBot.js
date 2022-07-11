import { SlashCommandBuilder } from '@discordjs/builders';
import lang from '#lang';
import errorMessage from '#errormessage';

async function create() {
	const command = new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Flips a coin')
		.setDMPermission(true);

	return command.toJSON();
}
async function execute(interaction) {
	const locale = interaction.locale;
	try {
		// Replys with Heads or Tails with a chance of 50%
		await interaction.reply(
			Math.random() < 0.5
				? await lang('HEADS', {}, locale)
				: await lang('TAILS', {}, locale)
		);
	} catch (error) {
		errorMessage(interaction, error);
	}
}

export { create, execute };
