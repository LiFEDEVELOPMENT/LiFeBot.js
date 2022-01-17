import { MessageActionRow, MessageEmbed, MessageButton } from 'discord.js';
import quoteUtil from '#util/QuoteUtil';
import lang from '#lang';
import errorMessage from '#errormessage';

async function execute(interaction) {
	try {
		const locale = interaction.locale;
		let quoteList = await quoteUtil.charLimitList(interaction.guild.id);
		let oldEmbed = interaction.message.embeds[0];
		let oldTitle = oldEmbed.title.split('Page ');
		let page =
			parseInt(oldTitle[1]) < quoteList.length
				? parseInt(oldTitle[1])
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
				.setLabel(await lang('FIRST_PAGE', {}, locale))
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId('quotes/previousPage')
				.setStyle('PRIMARY')
				.setLabel(await lang('PREVIOUS_PAGE', {}, locale))
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId('quotes/nextPage')
				.setStyle('PRIMARY')
				.setLabel(await lang('NEXT_PAGE', {}, locale))
				.setDisabled(nextButtonsDisabled),
			new MessageButton()
				.setCustomId('quotes/lastPage')
				.setStyle('PRIMARY')
				.setLabel(await lang('LAST_PAGE', {}, locale))
				.setDisabled(nextButtonsDisabled)
		);

		await interaction.update({
			embeds: [newEmbed],
			components: [actionRow],
		});
	} catch (error) {
		errorMessage(interaction, error);
	}
}

export { execute };
