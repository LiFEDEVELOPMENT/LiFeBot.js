import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import lang from '#lang';

async function create() {
	const command = new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from your server')
        .addUserOption((option) =>
            option
                .setName('target')
                .setDescription('The User you want to ban from your server')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('reason')
                .setDescription('The reason for the ban')
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
				: await lang('BAN_EXECUTE_NOREASON', {}, guildid);

		if (!target)
			return interaction.reply({
				content: await lang('BAN_EXECUTE_MEMBER_FETCH_ERROR', {}, guildid),
				ephemeral: true,
			});
		if (!target.bannable || target.user.id == interaction.client.user.id)
			return interaction.reply(
				await lang('BAN_EXECUTE_HIERACHY_ERROR', {}, guildid)
			);
		if (
			interaction.member.roles.highest.position <=
				target.roles.highest.position ||
			!interaction.member.permissions.has('BAN_MEMBERS')
		)
			return interaction.reply(
				await lang('BAN_EXECUTE_PERMISSION_ERROR', {}, guildid)
			);

		const banEmbed = new MessageEmbed()
			.setTitle(`${target.user.tag}`)
			.setDescription(
				await lang(
					'BAN_EXECUTE_EMBED_DESCRIPTION',
					{ BANREASON: reason },
					guildid
				)
			)
			.setColor('RED')
			.setFooter({ text: moderator.displayName })
			.setTimestamp();
		const banMessage = await lang(
			'BAN_EXECUTE_TARGET_DM',
			{
				GUILDNAME: interaction.guild.name,
				BANREASON: reason,
			},
			guildid
		);

		await member.ban({ reason });
		await member.user.send(banMessage);
		await interaction.reply({ embeds: [banEmbed] });
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR'),
			ephemeral: true,
		});
	}
}

export default { create, execute };
