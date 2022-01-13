import { MessageActionRow, MessageEmbed, MessageButton } from 'discord.js';
import memeUtil from '#util/MemeUtil.js';
import lang from '#lang';

async function execute(interaction) {
	const guildid = interaction.guild.id;
	let oldEmbed = interaction.message.embeds[0];
	let title = oldEmbed.title.split(
		await lang('EMBED_TITLE_SPLIT', {}, guildid)
	);
	let memeList = await memeUtil.charLimitList(interaction.guild.id);
	let page = parseInt(title[title.length - 1]); // 1-indexed at UI, so just take that for index + 1

	page = page >= 0 ? (page < memeList.length ? page : memeList.length - 1) : 0;
	const previousButtonsDisabled = !(page > 0);
	const nextButtonsDisabled = !(page < memeList.length - 1);

	let newEmbed = new MessageEmbed()
		.setTitle(
			await lang(
				'EMBED_TITLE_PAGE',
				{
					TITLE: title[0],
					PAGE: page + 1,
				},
				guildid
			)
		)
		.setDescription(memeList[page])
		.setTimestamp();

	const actionRow = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('memes/firstPage')
			.setStyle('PRIMARY')
			.setLabel(await lang('FIRST_PAGE', {}, guildid))
			.setDisabled(previousButtonsDisabled),
		new MessageButton()
			.setCustomId('memes/previousPage')
			.setStyle('PRIMARY')
			.setLabel(await lang('PREVIOUS_PAGE', {}, guildid))
			.setDisabled(previousButtonsDisabled),
		new MessageButton()
			.setCustomId('memes/nextPage')
			.setStyle('PRIMARY')
			.setLabel(await lang('NEXT_PAGE', {}, guildid))
			.setDisabled(nextButtonsDisabled),
		new MessageButton()
			.setCustomId('memes/lastPage')
			.setStyle('PRIMARY')
			.setLabel(await lang('LAST_PAGE', {}, guildid))
			.setDisabled(nextButtonsDisabled)
	);

	interaction.update({
		embeds: [newEmbed],
		components: [actionRow],
	});
}

export default { execute };
