const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const lang = require('@lang');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription(await lang.getString('BAN_COMMAND_DESCRIPTION'))
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription(await lang.getString('BAN_TARGET_DESCRIPTION'))
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('reason')
				.setDescription(await lang.getString('BAN_REASON_DESCRIPTION'))
		),
	async execute(interaction) {
		const guildid = interaction.guild.id;
		// Prepares constants for the information in the confirmation MessageEmbed
		const target = interaction.options.getUser('target');
		const member =
			interaction.guild.members.cache.get(target.id) ||
			(await interaction.guild.members.fetch(target.id).catch((err) => {}));
		const reason =
			interaction.options.getString('reason') != null
				? interaction.options.getString('reason')
				: await lang.getString('BAN_NO_REASON', {}, guildid);
		const moderator =
			interaction.member.nickname != null
				? `${interaction.member.nickname}`
				: `${interaction.member.user.username}`;

		// Prepares an MessageEmbed containing information about the ban
		const banEmbed = new MessageEmbed()
			.setTitle(`${member.user.tag}`)
			.setDescription(
				await lang.getString(
					'BAN_EMBED_DESCRIPTION',
					{ BANREASON: reason },
					guildid
				)
			)
			.setColor('RED')
			.setFooter({ text: moderator })
			.setTimestamp();

		// Creates a message for the target user informing him about his ban

		const banMessage = await lang.getString(
			'BAN_YOU_GOT_BANNED',
			{
				GUILDNAME: interaction.guild.name,
				BANREASON: reason,
			},
			guildid
		);

		// Checks if the executor has the permissions to ban the target and the target can be banned
		if (!member)
			return interaction.reply({
				content: lang.getString('BAN_FETCH_MEMBER_FAIL', {}, guildid),
				ephemeral: true,
			});
		if (!member.bannable || member.user.id === interaction.client.user.id)
			return interaction.reply(
				lang.getString('BAN_HIERACHY_FAIL', {}, guildid)
			);
		if (
			interaction.member.roles.highest.position <=
				member.roles.highest.position ||
			!interaction.member.permissions.has('BAN_MEMBERS')
		)
			return interaction.reply(
				await lang.getString('BAN_PERMISSION_FAIL', {}, guildid)
			);

		// Sends the previously created banMessage via DM and bans the target
		await member.user.send(banMessage).catch((err) => {
			console.err(err);
		});
		await member.ban({ reason });

		await interaction.reply({ embeds: [banEmbed] });
	},
};
