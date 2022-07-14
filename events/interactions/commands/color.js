import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import lang from '#util/Lang';
import errorMessage from '#errormessage';

const create = () => {
	const command = new SlashCommandBuilder()
		.setName('color')
		.setDescription('Sends an image of the color you want')
		.addStringOption((option) =>
			option
				.setName('hex')
				.setDescription('Hex-code of the color. Use format #RRGGBB')
				.setRequired(true)
		)
		.setDMPermission(true);

	return command.toJSON();
};

const execute = (interaction) => {
	try {
		const locale = interaction.locale;
		const hexRegEx = /#[0-9A-Fa-f]{6}/g;
		const color = interaction.options.getString('hex');

		if (!hexRegEx.test(color))
			return interaction.reply(lang('COLOR_EXECUTE_WRONG_FORMAT', locale));

		const colorEmbed = new MessageEmbed()
			.setTitle(color)
			.setColor(color)
			.setThumbnail(
				'https://singlecolorimage.com/get/' + color.substring(1) + '/500x500'
			);

		interaction.reply({ embeds: [colorEmbed] });
	} catch (error) {
		errorMessage(interaction, error);
	}
};

export { create, execute };
