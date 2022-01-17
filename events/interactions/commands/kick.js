import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, Permissions } from 'discord.js';
import lang from '#lang';
import errorMessage from '#errormessage';

async function create() {
	const command = new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks a user from your server')
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('The user you want to kick from your server')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option.setName('reason').setDescription('The reason for the kick')
		);

	return command.toJSON();
}
async function execute(interaction) {
	const locale = interaction.locale;
	try {
		const options = interaction.options;
		const moderator = interaction.member;
		const target = interaction.guild.members.cache.get(
			interaction.options.getUser('target').id
		);
		const reason =
			options.getString('reason') ??
			(await lang('KICK_EXECUTE_NO_REASON', {}, locale));
		const directMessage = `You got kicked from **${
			interaction.guild.name
		}**.\nReason: ${Util.escapeMarkdown(reason)}`;
		const kickEmbed = new MessageEmbed()
			.setTitle(target.user.tag)
			.setDescription(
				await lang(
					'KICK_EXECUTE_EMBED_DESCRIPTION',
					{ KICKREASON: Util.escapeMarkdown(reason) },
					locale
				)
			)
			.setFooter({ text: moderator.displayName })
			.setColor('RED')
			.setTimestamp();

		// Check if the target can be kicked by the executing user
		if (
			!target.kickable ||
			target.user.id == interaction.client.user.id ||
			target.user.bot
		)
			return interaction.reply(
				await lang('KICK_EXECUTE_HIERACHY_ERROR', {}, locale)
			);
		if (
			moderator.roles.highest.position <= target.roles.highest.position ||
			!moderator.permissions.has(Permissions.FLAGS.KICK_MEMBERS)
		)
			return interaction.reply(
				await lang('KICK_EXECUTE_PERMISSION_ERROR', {}, locale)
			);

		await target.kick({ reason });
		await target.user.send(directMessage);
		await interaction.reply({ embeds: [kickEmbed] });
	} catch (error) {
		errorMessage(interaction, error);
	}
}

export { create, execute };
