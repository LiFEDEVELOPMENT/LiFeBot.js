import { MessageActionRow, MessageEmbed, MessageButton } from 'discord.js';
import noteUtil from '#util/NotesUtil';
import errorMessage from '#errormessage';

async function execute(interaction) {
	try {
		let notesList = await noteUtil.charLimitList(interaction.guild.id);
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
				.setCustomId('notes/firstPage')
				.setStyle('PRIMARY')
				.setLabel('First page')
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId('notes/previousPage')
				.setStyle('PRIMARY')
				.setLabel('Previous Page')
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId('notes/mextPage')
				.setStyle('PRIMARY')
				.setLabel('Next Page')
				.setDisabled(nextButtonsDisabled),
			new MessageButton()
				.setCustomId('notes/lastPage')
				.setStyle('PRIMARY')
				.setLabel('Last Page')
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
