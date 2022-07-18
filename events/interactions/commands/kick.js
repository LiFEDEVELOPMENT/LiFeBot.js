import {
	EmbedBuilder,
	escapeMarkdown,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from 'discord.js';
import lang from '#util/Lang';
import errorMessage from '#errormessage';

const create = () => {
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
		)
		.setDMPermission(false);

	return command.toJSON();
};

const execute = (interaction) => {
	try {
		const locale = interaction.locale;
		const options = interaction.options;
		const moderator = interaction.member;
		const target = interaction.guild.members.cache.get(
			interaction.options.getUser('target').id
		);

		const reason =
			options.getString('reason') ?? lang('KICK_EXECUTE_NO_REASON', locale);
		const directMessage = `You got kicked from **${
			interaction.guild.name
		}**.\nReason: ${escapeMarkdown(reason)}`;

		const kickEmbed = new EmbedBuilder()
			.setTitle(target.user.tag)
			.setDescription(
				lang('KICK_EXECUTE_EMBED_DESCRIPTION', locale, {
					KICKREASON: escapeMarkdown(reason),
				})
			)
			.setFooter({ text: moderator.displayName })
			.setColor('Red')
			.setTimestamp();

		// Check if the target can be kicked by the executing user
		if (
			!target.kickable ||
			target.user.id === interaction.client.user.id ||
			target.user.bot
		)
			return interaction.reply(lang('KICK_EXECUTE_HIERACHY_ERROR', locale));

		if (
			moderator.roles.highest.position <= target.roles.highest.position ||
			!moderator.permissions.has(PermissionFlagsBits.KickMembers)
		)
			return interaction.reply(lang('KICK_EXECUTE_PERMISSION_ERROR', locale));

		target.kick({ reason });
		target.user.send(directMessage);
		interaction.reply({ embeds: [kickEmbed] });
	} catch (error) {
		errorMessage(interaction, error);
	}
};

export { create, execute };
