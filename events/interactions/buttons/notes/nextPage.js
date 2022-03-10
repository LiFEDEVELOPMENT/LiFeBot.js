import noteUtil from '#util/NotesUtil';
import errorMessage from '#errormessage';
import { MessageActionRow, MessageEmbed } from 'discord.js';

async function execute(interaction) {
	try {
		let noteList = await noteUtil.charLimitList(interaction.guild.id);
		let oldEmbed = interaction.message.embeds[0];
		let oldTitle = oldEmbed.title.split('Page ');
		let page =
			parseInt(oldTitle[1]) < noteList.length
				? parseInt(oldTitle[1])
				: noteList.length - 1;
		const previousButtonsDisabled = noteList.length < 1;
		const nextButtonsDisabled = page === noteList.length - 1;

		const newEmbed = new MessageEmbed()
			.setTitle(oldTitle[0] + `page${page + 1}`)
			.setDescription(noteList[page])
			.setTimestamp();

		const actionRow = new MessageActionRow.addComponents(
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
