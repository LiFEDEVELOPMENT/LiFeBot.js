import {
	ActionRowBuilder,
	ButtonStyle,
	EmbedBuilder,
	ButtonBuilder,
} from 'discord.js';
import sqlUtil from '#util/SQLUtil';
import lang from '#util/Lang';
import errorMessage from '#errormessage';

const execute = (interaction) => {
	try {
		const locale = interaction.locale;
		let quoteList = sqlUtil.charLimitList('quotes', interaction.guild.id);
		let oldEmbed = interaction.message.embeds[0];
		let oldTitle = oldEmbed.title.split('Page ');
		let page =
			parseInt(oldTitle[1]) < quoteList.length
				? parseInt(oldTitle[1])
				: quoteList.length - 1;
		const previousButtonsDisabled = page < 1;
		const nextButtonsDisabled = page === quoteList.length - 1;

		const newEmbed = new EmbedBuilder()
			.setTitle(oldTitle[0] + `Page ${page + 1}`)
			.setDescription(quoteList[page])
			.setTimestamp();

		const actionRow = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('quotes/firstPage')
				.setStyle(ButtonStyle.Primary)
				.setLabel(lang('FIRST_PAGE', locale))
				.setDisabled(previousButtonsDisabled),
			new ButtonBuilder()
				.setCustomId('quotes/previousPage')
				.setStyle(ButtonStyle.Primary)
				.setLabel(lang('PREVIOUS_PAGE', locale))
				.setDisabled(previousButtonsDisabled),
			new ButtonBuilder()
				.setCustomId('quotes/nextPage')
				.setStyle(ButtonStyle.Primary)
				.setLabel(lang('NEXT_PAGE', locale))
				.setDisabled(nextButtonsDisabled),
			new ButtonBuilder()
				.setCustomId('quotes/lastPage')
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
