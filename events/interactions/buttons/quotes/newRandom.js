import { MessageActionRow, MessageEmbed, MessageButton } from 'discord.js';
import quoteUtil from '#util/QuoteUtil';
import lang from '#lang';
import errorMessage from '#errormessage';

async function execute(interaction) {
	try {
		const locale = interaction.locale;
		const guildid = interaction.guild.id;
		let randomQuote = await quoteUtil.randomQuote(interaction.guild.id);
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
			.setTitle(await lang('QUOTE_EXECUTE_RANDOM_EMBED_TITLE', {}, locale))
			.setDescription(randomQuote.quote.toString())
			.setFooter({
				text: await lang(
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
				.setLabel(await lang('QUOTE_EXECUTE_RANDOM_BUTTON_TITLE', {}, locale))
		);

		interaction.update({
			embeds: [quoteEmbed],
			components: [actionRow],
		});
	} catch (error) {
		errorMessage(interaction, error);
	}
}

export { execute };
