import { SlashCommandBuilder } from '@discordjs/builders';
import lang from '#lang';

async function create() {
	const command = new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription(await lang('COINFLIP_COMMAND_DESCRIPTION'));

	return command.toJSON();
}
async function execute() {
	try {
		const guildid = interaction.guild.id;
		// Replys with Heads or Tails with a chance of 50%
		await interaction.reply(
			Math.random() < 0.5
				? await lang('HEADS', {}, guildid)
				: await lang('TAILS', {}, guildid)
		);
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR'),
			ephemeral: true,
		});
	}
}

export default { create, execute };
