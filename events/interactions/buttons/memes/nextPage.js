import { MessageActionRow, MessageEmbed, MessageButton } from 'discord.js';
import memeUtil from '#util/MemeUtil';
import lang from '#util/Lang';
import errorMessage from '#errormessage';

const execute = (interaction) => {
	try {
		const locale = interaction.locale;
		const memeList = memeUtil.charLimitList(interaction.guild.id);
		const oldEmbed = interaction.message.embeds[0];
		const oldTitle = oldEmbed.title.split('Page ');
		const page =
			parseInt(oldTitle[1]) < memeList.length
				? parseInt(oldTitle[1])
				: memeList.length - 1;
		const previousButtonsDisabled = page < 1;
		const nextButtonsDisabled = page === memeList.length - 1;

		const newEmbed = new MessageEmbed()
			.setTitle(oldTitle[0] + `Page ${page + 1}`)
			.setDescription(memeList[page])
			.setTimestamp();

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('memes/firstPage')
				.setStyle('PRIMARY')
				.setLabel(lang('FIRST_PAGE', locale))
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId('memes/previousPage')
				.setStyle('PRIMARY')
				.setLabel(lang('PREVIOUS_PAGE', locale))
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId('memes/nextPage')
				.setStyle('PRIMARY')
				.setLabel(lang('NEXT_PAGE', locale))
				.setDisabled(nextButtonsDisabled),
			new MessageButton()
				.setCustomId('memes/lastPage')
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
