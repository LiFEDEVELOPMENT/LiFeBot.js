import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import lang from '@lang';

async function create() {
	new SlashCommandBuilder()
		.setName('color')
		.setDescription(await lang('COLOR_COMMAND_DESCRIPTION'))
		.addStringOption((option) =>
			option
				.setName('hex')
				.setDescription(await lang('COLOR_COMMAND_HEX_DESCRIPTION'))
				.setRequired(true)
		);
}
async function execute(interaction) {
	try {
		const guildid = interaction.guild.id;
		const color =
			'#' +
			(interaction.options.getString('hex').startsWith('#')
				? interaction.options.getString('hex').substring(1)
				: interaction.options.getString('hex'));

		const colorEmbed = new MessageEmbed()
			.setTitle(color)
			.setColor(color)
			.setThumbnail(
				'https://singlecolorimage.com/get/' + color.substring(1) + '/400x400'
			);

		await interaction.reply({ embeds: [colorEmbed] });
	} catch (error) {
		console.log(error);
		interaction.reply({
			content: await lang('ERROR'),
			ephemeral: true,
		});
	}
}

export default { create, execute };
