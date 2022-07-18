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
		.setName('ban')
		.setDescription('Bans a user from your server')
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('The user you want to ban from your server')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option.setName('reason').setDescription('The reason for the ban')
		)
		.setDMPermission(false);

	return command.toJSON();
};

const execute = (interaction) => {
	try {
		const locale = interaction.locale;
		const options = interaction.options;
		const moderator = interaction.member;
		const target = options.getMember('target');

		const reason =
			options.getString('reason') ?? lang('BAN_EXECUTE_NO_REASON', locale);
		const directMessage = `You were banned from **${
			interaction.guild.name
		}**.\nReason: ${escapeMarkdown(reason)}`;

		const banEmbed = new EmbedBuilder()
			.setTitle(target.user.tag)
			.setDescription(
				lang('BAN_EXECUTE_EMBED_DESCRIPTION', locale, {
					BANREASON: escapeMarkdown(reason),
				})
			)
			.setFooter({ text: moderator.displayName })
			.setColor('Red')
			.setTimestamp();

		// Check if the target can be banned by the executing user
		if (
			!target.bannable ||
			target.user.id === interaction.client.user.id ||
			target.user.bot
		)
			return interaction.reply(lang('BAN_EXECUTE_HIERACHY_ERROR', locale));

		if (
			moderator.roles.highest.position <= target.roles.highest.position ||
			!moderator.permissions.has(PermissionFlagsBits.BanMembers)
		)
			return interaction.reply(lang('BAN_EXECUTE_PERMISSION_ERROR', locale));

		target.ban({ reason });
		target.user.send(directMessage);
		interaction.reply({ embeds: [banEmbed] });
	} catch (error) {
		errorMessage(interaction, error);
	}
};

export { create, execute };
