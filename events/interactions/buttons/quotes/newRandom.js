import { MessageActionRow, MessageEmbed, MessageButton } from 'discord.js';
import quoteUtil from '#util/QuoteUtil';
import lang from '#util/Lang';
import errorMessage from '#errormessage';

const execute = async (interaction) => {
	try {
		const locale = interaction.locale;
		let randomQuote = quoteUtil.randomQuote(interaction.guild.id);
		let quoteCreator = await interaction.client.users
			.fetch(randomQuote.author)
			.catch(() => {
				return {
					username: 'n/a',
				};
			});
		let date = new Date(randomQuote.time).toLocaleDateString('de-DE', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});

		const quoteEmbed = new MessageEmbed()
			.setTitle(lang('QUOTE_EXECUTE_RANDOM_EMBED_TITLE', locale))
			.setDescription(randomQuote.quote.toString())
			.setFooter({
				text: lang(
					'QUOTE_EXECUTE_RANDOM_EMBED_FOOTER',
					{
						DATE: date,
						CREATOR: quoteCreator.username,
						QUOTEID: randomQuote.id,
					},
					locale
				),
			})
			.setColor('YELLOW');

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('quotes/newRandom')
				.setStyle('PRIMARY')
				.setLabel(lang('QUOTE_EXECUTE_RANDOM_BUTTON_TITLE', locale))
		);

		interaction.update({
			embeds: [quoteEmbed],
			components: [actionRow],
		});
	} catch (error) {
		errorMessage(interaction, error);
	}
};

export { execute };
