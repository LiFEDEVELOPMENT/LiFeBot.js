import { SlashCommandBuilder } from '@discordjs/builders';
import lang from '#util/Lang';
import errorMessage from '#errormessage';

const create = () => {
	const command = new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Flips a coin')
		.setDMPermission(true);

	return command.toJSON();
};

const execute = (interaction) => {
	const locale = interaction.locale;
	try {
		// Replys with Heads or Tails with a chance of 50%
		interaction.reply(
			Math.random() < 0.5 ? lang('HEADS', locale) : lang('TAILS', locale)
		);
	} catch (error) {
		errorMessage(interaction, error);
	}
};

export { create, execute };
