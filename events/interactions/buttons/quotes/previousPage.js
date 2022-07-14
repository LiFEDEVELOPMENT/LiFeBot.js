import { MessageActionRow, MessageEmbed, MessageButton } from 'discord.js';
import quoteUtil from '#util/QuoteUtil';
import lang from '#util/Lang';
import errorMessage from '#errormessage';

const execute = (interaction) => {
	try {
		const locale = interaction.locale;
		let quoteList = quoteUtil.charLimitList(interaction.guild.id);
		let oldEmbed = interaction.message.embeds[0];
		let oldTitle = oldEmbed.title.split('Page ');
		let page =
			parseInt(oldTitle[1]) - 2 >= 0
				? parseInt(oldTitle[1]) - 2
				: quoteList.length - 1;
		const previousButtonsDisabled = page < 1;
		const nextButtonsDisabled = page === quoteList.length - 1;

		const newEmbed = new MessageEmbed()
			.setTitle(oldTitle[0] + `Page ${page + 1}`)
			.setDescription(quoteList[page])
			.setTimestamp();

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('quotes/firstPage')
				.setStyle('PRIMARY')
				.setLabel(lang('FIRST_PAGE', locale))
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId('quotes/previousPage')
				.setStyle('PRIMARY')
				.setLabel(lang('PREVIOUS_PAGE', locale))
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId('quotes/nextPage')
				.setStyle('PRIMARY')
				.setLabel(lang('NEXT_PAGE', locale))
				.setDisabled(nextButtonsDisabled),
			new MessageButton()
				.setCustomId('quotes/lastPage')
				.setStyle('PRIMARY')
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
