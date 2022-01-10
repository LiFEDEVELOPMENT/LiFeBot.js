const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const lang = require('@lang');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription(await lang.getString('ANNOUNCE_COMMAND_DESCRIPTION'))
		.addStringOption((option) =>
			option
				.setName('message')
				.setDescription(await lang.getString('ANNOUNCE_MESSAGE_DESCRIPTION'))
				.setRequired(true)
		)
		.addRoleOption((option) =>
			option
				.setName('role')
				.setDescription(await lang.getString('ANNOUNCE_ROLE_DESCRIPTION'))
		),
	async execute(interaction) {
		const guildid = interaction.guild.id;
		// Prepare MessageEmbed for the announce
		const announceEmbed = new MessageEmbed()
			.setColor('YELLOW')
			.setTitle('Announce')
			.setDescription(
				(interaction.options.getRole('role') != null
					? '<@&' + interaction.options.getRole('role') + '> \n\n'
					: '') + interaction.options.getString('message')
			)
			.setFooter({
				text:
					interaction.member.nickname != null
						? `${interaction.member.nickname}`
						: `${interaction.member.user.username}`,
			});

		await interaction.channel.send({ embeds: [announceEmbed] });
		await interaction.reply({
			content: await lang.getString('ANNOUNCE_SUCCESS', {}, guildid),
			ephemeral: true,
		});
	},
};
