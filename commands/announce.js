const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Announced eine Nachricht!')
		.addStringOption((option) =>
			option
				.setName('message')
				.setDescription('Die Nachricht, die announced werden soll')
				.setRequired(true)
		)
		.addRoleOption((option) =>
			option
				.setName('role')
				.setDescription('Die Rolle, die in der Nachricht erwähnt werden soll')
		),
	async execute(interaction) {
		// Prepare MessageEmbed for the announce
		const announceEmbed = new MessageEmbed()
			.setColor('YELLOW')
			.setTitle('Announce')
			.setDescription(
				(interaction.options.getRole('role') != null
					? '<@&' + interaction.options.getRole('role') + '> \n\n'
					: '') + interaction.options.getString('message')
			)
			.setFooter(
				interaction.member.nickname != null
					? `${interaction.member.nickname}`
					: `${interaction.member.user.username}`
			);

		await interaction.channel.send({ embeds: [announceEmbed] });
		await interaction.reply({
			content: 'Die Nachricht wurde announced!',
			ephemeral: true,
		});
	},
};
