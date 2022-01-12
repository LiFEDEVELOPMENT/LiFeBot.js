import { SlashCommandBuilder } from '@discordjs/builders';
import lang from '@lang';

async function create() {
	new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription(await lang('COINFLIP_COMMAND_DESCRIPTION'));
}
async function execute() {
	try {
		const guildid = interaction.guild.id;
		// Replys with Heads or Tails with a chance of 50%
		await interaction.reply(
			Math.random() < 0.5
				? await lang.getString('HEADS', {}, guildid)
				: await lang.getString('TAILS', {}, guildid)
		);
	} catch (error) {
		console.log(error);
		interaction.reply({
			content: await lang('ERROR'),
			ephemeral: true,
		});
	}
}

export default { create, execute };
