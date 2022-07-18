import {
	ActionRowBuilder,
	ButtonStyle,
	EmbedBuilder,
	ButtonBuilder,
} from 'discord.js';
import memeUtil from '#util/MemeUtil';
import lang from '#util/Lang';
import errorMessage from '#errormessage';

const execute = (interaction) => {
	try {
		const locale = interaction.locale;
		const memeList = memeUtil.charLimitList(interaction.guild.id);
		const oldEmbed = interaction.message.embeds[0];
		const oldTitle = oldEmbed.title.split('Page ');
		const page = parseInt(oldTitle[1] - 2) >= 0 ? parseInt(oldTitle[1] - 2) : 0;
		const previousButtonsDisabled = page < 1;
		const nextButtonsDisabled = page === memeList.length - 1;

		const newEmbed = new EmbedBuilder()
			.setTitle(oldTitle[0] + `Page ${page + 1}`)
			.setDescription(memeList[page])
			.setTimestamp();

		const actionRow = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('memes/firstPage')
				.setStyle(ButtonStyle.Primary)
				.setLabel(lang('FIRST_PAGE', locale))
				.setDisabled(previousButtonsDisabled),
			new ButtonBuilder()
				.setCustomId('memes/previousPage')
				.setStyle(ButtonStyle.Primary)
				.setLabel(lang('PREVIOUS_PAGE', locale))
				.setDisabled(previousButtonsDisabled),
			new ButtonBuilder()
				.setCustomId('memes/nextPage')
				.setStyle(ButtonStyle.Primary)
				.setLabel(lang('NEXT_PAGE', locale))
				.setDisabled(nextButtonsDisabled),
			new ButtonBuilder()
				.setCustomId('memes/lastPage')
				.setStyle(ButtonStyle.Primary)
				.setLabel(lang('LAST_PAGE', locale))
				.setDisabled(nextButtonsDisabled)
		);

		interaction.update({
			embeds: [newEmbed],
			components: [actionRow],
		});
	} catch (error) {
		errorMessage(interaction, error);
	}
};
export { execute };
