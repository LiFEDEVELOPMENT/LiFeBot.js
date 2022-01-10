const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const lang = require('@lang');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('color')
		.setDescription(await lang.getString('COLOR_COMMAND_DESCRIPTION'))
		.addStringOption((option) =>
			option
				.setName('hex')
				.setDescription(await lang.getString('COLOR_HEX_DESCRIPTION'))
				.setRequired(true)
		),
	async execute(interaction) {
		const guildid = interaction.guild.id;
		try {
			// Save color as #RRGGBB, regardless of the color being in the format #RRGGBB or just RRGGBB
			const color =
				'#' +
				(interaction.options.getString('hex').startsWith('#')
					? interaction.options.getString('hex').substring(1)
					: interaction.options.getString('hex'));

			// Creates an MessageEmbed with the #RRGGBB as a title and a picture/surface with that color
			const colorEmbed = new MessageEmbed()
				.setTitle(color)
				.setColor(color)
				.setThumbnail(
					'https://singlecolorimage.com/get/' + color.substring(1) + '/400x400'
				);

			await interaction.reply({ embeds: [colorEmbed] });
		} catch (error) {
			// Catches any formatting mistakes by the executor and replys an error
			await interaction.reply(await lang.getString('COLOR_FAIL', {}, guildid));
		}
	},
};
