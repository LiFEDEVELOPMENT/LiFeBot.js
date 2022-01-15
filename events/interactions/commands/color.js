import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import lang from '#lang';

async function create() {
	const command = new SlashCommandBuilder()
		.setName('color')
		.setDescription('Sends an image of the color you want')
		.addStringOption((option) =>
			option
				.setName('hex')
				.setDescription('Hex-code of the color. Use format #RRGGBB')
				.setRequired(true)
		);

	return command.toJSON();
}
async function execute(interaction) {
	const locale = interaction.locale;
	const hexRegEx = /#[0-9A-Fa-f]{6}/g;
	try {
		const color = interaction.options.getString('hex');

		if (!hexRegEx.test(color))
			return interaction.reply(
				await lang('COLOR_EXECUTE_WRONG_FORMAT', {}, locale)
			);

		const colorEmbed = new MessageEmbed()
			.setTitle(color)
			.setColor(color)
			.setThumbnail(
				'https://singlecolorimage.com/get/' + color.substring(1) + '/400x400'
			);

		await interaction.reply({ embeds: [colorEmbed] });
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR', {}, locale),
			ephemeral: true,
		});
	}
}

export { create, execute };
