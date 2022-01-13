import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import lang from '@lang';

async function create() {
	const command = new SlashCommandBuilder()
		.setName('announce')
		.setDescription(await lang('ANNOUNCE_COMMAND_DESCRIPTION'))
		.addStringOption((option) =>
			option
				.setName('message')
				.setDescription(await lang('ANNOUNCE_COMMAND_MESSAGE_DESCRIPTION'))
				.setRequired(true)
		)
		.addRoleOption((option) =>
			option
				.setName('role')
				.setDescription(await lang('ANNOUNCE_COMMAND_ROLE_DESCRIPTION'))
		);

	return command.toJSON();
}
async function execute(interaction) {
	try {
		const roleString =
			interaction.options.getRole('role') != null
				? `<@&${interaction.options.getRole('role')}> \n\n`
				: '';
		const announceMessage =
			roleString + interaction.options.getString('message');

		const announceEmbed = new MessageEmbed()
			.setColor('RED')
			.setTitle('Announce')
			.setDescription(announceMessage)
			.setFooter({
				text: interaction.member.displayName,
			});

		await interaction.channel.send({ embeds: [announceEmbed] });

		await interaction.reply({
			content: lang('ANNOUNCE_REPLY_SUCCESS'),
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
