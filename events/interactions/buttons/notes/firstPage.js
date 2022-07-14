import { MessageActionRow, MessageEmbed, MessageButton } from 'discord.js';
import noteUtil from '#util/NotesUtil';
import errorMessage from '#errormessage';

const execute = (interaction, query) => {
	try {
		let notesList;
		notesList =
			query === null
				? noteUtil.charLimitList(interaction.guild.id)
				: noteUtil.charLimitListQuery(interaction.guild.id, query);
		let oldEmbed = interaction.message.embeds[0];
		let oldTitle = oldEmbed.title.split('Page ');
		let page = 0;
		const previousButtonsDisabled = true;
		const nextButtonsDisabled = notesList.length < 2;

		const newEmbed = new MessageEmbed()
			.setTitle(oldTitle[0] + `Page ${page + 1}`)
			.setDescription(notesList[page])
			.setTimestamp();

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId(`notes/firstPage-${query}`)
				.setStyle('PRIMARY')
				.setLabel('First page')
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId(`notes/previousPage-${query}`)
				.setStyle('PRIMARY')
				.setLabel('Previous Page')
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId(`notes/nextPage-${query}`)
				.setStyle('PRIMARY')
				.setLabel('Next Page')
				.setDisabled(nextButtonsDisabled),
			new MessageButton()
				.setCustomId(`notes/lastPage-${query}`)
				.setStyle('PRIMARY')
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
