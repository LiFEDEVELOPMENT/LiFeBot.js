import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, Permissions } from 'discord.js';
import lang from '#lang';

async function create() {
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
		);

	return command.toJSON();
}
async function execute(interaction) {
	const locale = interaction.locale;
	try {
		const options = interaction.options;
		const moderator = interaction.member;
		const target = interaction.guild.members.cache.get(
			options.getUser('target').id
		);
		const reason =
			options.getString('reason') != null
				? options.getString('reason')
				: await lang('BAN_EXECUTE_NO_REASON', {}, locale);
		const directMessage = `You got banned from **${interaction.guild.name}**.\nReason: ${reason}`;
		const banEmbed = new MessageEmbed()
			.setTitle(target.user.tag)
			.setDescription(
				await lang(
					'BAN_EXECUTE_EMBED_DESCRIPTION',
					{ BANREASON: reason },
					locale
				)
			)
			.setFooter({ text: moderator.displayName })
			.setColor('RED')
			.setTimestamp();

		// Check if the target can be banned by the executing user
		if (
			!target.bannable ||
			target.user.id == interaction.client.user.id ||
			target.user.bot
		)
			return interaction.reply(
				await lang('BAN_EXECUTE_HIERACHY_ERROR', {}, locale)
			);
		if (
			moderator.roles.highest.position <= target.roles.highest.position ||
			!moderator.permissions.has(Permissions.FLAGS.BAN_MEMBERS)
		)
			return interaction.reply(
				await lang('BAN_EXECUTE_PERMISSION_ERROR', {}, locale)
			);

		await target.ban({ reason });
		await target.user.send(directMessage);
		await interaction.reply({ embeds: [banEmbed] });
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR', {}, locale),
			ephemeral: true,
		});
	}
}

export { create, execute };
