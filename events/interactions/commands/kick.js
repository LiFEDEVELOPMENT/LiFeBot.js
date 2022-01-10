const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const lang = require('@lang');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription(await lang.getString('KICK_COMMAND_DESCRIPTION'))
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription(await lang.getString('KICK_TARGET_DESCRIPTION'))
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('reason')
				.setDescription(await lang.getString('KICK_REASON_DESCRIPTION'))
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
				: await lang.getString('KICK_NO_REASON', {}, guildid);
		const moderator =
			interaction.member.nickname != null
				? `${interaction.member.nickname}`
				: `${interaction.member.user.username}`;

		// Prepares an MessageEmbed containing information about the kick
		const kickEmbed = new MessageEmbed()
			.setTitle(`${member.user.tag}`)
			.setDescription(
				await lang.getString(
					'KICK_EMBED_DESCRIPTION',
					{ KICKREASON: reason },
					guildid
				)
			)
			.setColor('RED')
			.setFooter({ text: moderator })
			.setTimestamp();

		// Creates a message for the target user informing him about his kick
		const kickMessage = await lang.getString(
			'KICK_YOU_GOT_KICKED',
			{
				GUILDNAME: interaction.guild.name,
				KICKREASON: reason,
			},
			guildid
		);

		// Checks if the executor has the permissions to kick the target and the target can be kicked
		if (!member)
			return interaction.reply(
				await lang.getString('KICK_FETCH_MEMBER_FAIL', {}, guildid)
			);
		if (!member.kickable || member.user.id === interaction.client.user.id)
			return interaction.reply(
				await lang.getString('KICK_HIERACHY_FAIL', {}, guildid)
			);
		if (
			interaction.member.roles.highest.position <=
				member.roles.highest.position ||
			!interaction.member.permissions.has('KICK_MEMBERS')
		)
			return interaction.reply(
				await lang.getString('KICK_PERMISSION_FAIL', {}, guildid)
			);

		// Sends the previously created kickMessage via DM and kicks the target
		await member.user.send(kickMessage).catch((err) => {
			console.log(err);
		});
		await member.kick({ reason });

		await interaction.reply({ embeds: [kickEmbed] });
	},
};
