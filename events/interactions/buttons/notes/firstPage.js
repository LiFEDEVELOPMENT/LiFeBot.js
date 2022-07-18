import {
	ActionRowBuilder,
	ButtonStyle,
	EmbedBuilder,
	ButtonBuilder,
} from 'discord.js';
import sqlUtil from '#util/SQLUtil';
import errorMessage from '#errormessage';

const execute = (interaction, query) => {
	try {
		let notesList = sqlUtil.charLimitList('notes', interaction.guild.id, query);
		let oldEmbed = interaction.message.embeds[0];
		let oldTitle = oldEmbed.title.split('Page ');
		let page = 0;
		const previousButtonsDisabled = true;
		const nextButtonsDisabled = notesList.length < 2;

		const newEmbed = new EmbedBuilder()
			.setTitle(oldTitle[0] + `Page ${page + 1}`)
			.setDescription(notesList[page])
			.setTimestamp();

		const actionRow = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId(`notes/firstPage-${query}`)
				.setStyle(ButtonStyle.Primary)
				.setLabel('First page')
				.setDisabled(previousButtonsDisabled),
			new ButtonBuilder()
				.setCustomId(`notes/previousPage-${query}`)
				.setStyle(ButtonStyle.Primary)
				.setLabel('Previous Page')
				.setDisabled(previousButtonsDisabled),
			new ButtonBuilder()
				.setCustomId(`notes/nextPage-${query}`)
				.setStyle(ButtonStyle.Primary)
				.setLabel('Next Page')
				.setDisabled(nextButtonsDisabled),
			new ButtonBuilder()
				.setCustomId(`notes/lastPage-${query}`)
				.setStyle(ButtonStyle.Primary)
				.setLabel('Last Page')
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
