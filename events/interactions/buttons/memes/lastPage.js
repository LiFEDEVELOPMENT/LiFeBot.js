import { MessageActionRow, MessageEmbed, MessageButton } from 'discord.js';
import memeUtil from '#util/MemeUtil';
import lang from '#lang';

async function execute(interaction) {
	const locale = interaction.locale;
	const memeList = memeUtil.charLimitList(interaction.guild.id);
	const oldEmbed = interaction.message.embeds[0];
	const oldTitle = oldEmbed.title.split('Page ');
	const page = memeList.length - 1;
	const previousButtonsDisabled = memeList.length < 2;
	const nextButtonsDisabled = true;

	const newEmbed = new MessageEmbed()
		.setTitle(oldTitle[0] + `Page ${page + 1}`)
		.setDescription(memeList[page])
		.setTimestamp();

	const actionRow = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('memes/firstPage')
			.setStyle('PRIMARY')
			.setLabel(await lang('FIRST_PAGE', {}, locale))
			.setDisabled(previousButtonsDisabled),
		new MessageButton()
			.setCustomId('memes/previousPage')
			.setStyle('PRIMARY')
			.setLabel(await lang('PREVIOUS_PAGE', {}, locale))
			.setDisabled(previousButtonsDisabled),
		new MessageButton()
			.setCustomId('memes/nextPage')
			.setStyle('PRIMARY')
			.setLabel(await lang('NEXT_PAGE', {}, locale))
			.setDisabled(nextButtonsDisabled),
		new MessageButton()
			.setCustomId('memes/lastPage')
			.setStyle('PRIMARY')
			.setLabel(await lang('LAST_PAGE', {}, locale))
			.setDisabled(nextButtonsDisabled)
	);

	await interaction.update({
		embeds: [newEmbed],
		components: [actionRow],
	});
}
export { execute };
