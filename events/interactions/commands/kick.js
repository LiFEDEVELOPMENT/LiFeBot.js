import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import lang from '@lang';

async function create() {
	const command = new SlashCommandBuilder().setName('kick').setDescription(
		await lang('KICK_COMMAND_DESCRIPTION')
			.addUserOption((option) =>
				option
					.setName('target')
					.setDescription(await lang('KICK_COMMAND_TARGET_DESCRIPTION'))
					.setRequired(true)
			)
			.addStringOption((option) =>
				option
					.setName('reason')
					.setDescription(await lang('KICK_COMMAND_REASON_DESCRIPTION'))
			)
	);
	return command.toJSON();
}
async function execute(interaction) {
	try {
		const guildid = interaction.guild.id;
		const target = interaction.guild.members.cache.get(
			interaction.options.getUser('target').id
		);
		const moderator = interaction.member;
		const reason =
			interaction.options.getString('reason') != null
				? interaction.options.getString('reason')
				: await lang('KICK_EXECUTE_NOREASON', {}, guildid);

		if (!target)
			return interaction.reply({
				content: await lang('KICK_EXECUTE_MEMBER_FETCH_ERROR', {}, guildid),
				ephemeral: true,
			});
		if (!target.kickable || target.user.id == interaction.client.user.id)
			return interaction.reply(
				await lang('KICK_EXECUTE_HIERACHY_ERROR', {}, guildid)
			);
		if (
			interaction.member.roles.highest.position <=
				target.roles.highest.position ||
			!interaction.member.permissions.has('KICK_MEMBERS')
		)
			return interaction.reply(
				await lang('KICK_EXECUTE_PERMISSION_ERROR', {}, guildid)
			);

		const kickEmbed = new MessageEmbed()
			.setTitle(`${target.user.tag}`)
			.setDescription(
				await lang(
					'KICK_EXECUTE_EMBED_DESCRIPTION',
					{ KICKREASON: reason },
					guildid
				)
			)
			.setColor('RED')
			.setFooter({ text: moderator.displayName })
			.setTimestamp();
		const kickMessage = await lang(
			'KICK_EXECUTE_TARGET_DM',
			{
				GUILDNAME: interaction.guild.name,
				KICKREASON: reason,
			},
			guildid
		);

		await member.kick({ reason });
		await member.user.send(kickMessage);
		await interaction.reply({ embeds: [kickEmbed] });
	} catch (error) {
		console.log(error);
		interaction.reply({
			content: await lang('ERROR'),
			ephemeral: true,
		});
	}
}

export default { create, execute };
