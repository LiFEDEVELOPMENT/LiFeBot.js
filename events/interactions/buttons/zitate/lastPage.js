import { MessageActionRow, MessageEmbed, MessageButton } from 'discord.js';
import zitatUtil from '#util/ZitatUtil.js';
import lang from '#lang';

async function execute(interaction) {
	const guildid = interaction.guild.id;
	let oldEmbed = interaction.message.embeds[0];
	let title = oldEmbed.title.split(
		await lang('EMBED_TITLE_SPLIT', {}, guildid)
	);
	let zitatList = await zitatUtil.charLimitList(interaction.guild.id);
	let page = zitatList.length - 1;

	const previousButtonsDisabled = !(page > 0);
	const nextButtonsDisabled = !(page < zitatList.length - 1);

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
		.setDescription(zitatList[page])
		.setTimestamp();

	const actionRow = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('zitate/firstPage')
			.setStyle('PRIMARY')
			.setLabel(await lang('FIRST_PAGE', {}, guildid))
			.setDisabled(previousButtonsDisabled),
		new MessageButton()
			.setCustomId('zitate/previousPage')
			.setStyle('PRIMARY')
			.setLabel(await lang('PREVIOUS_PAGE', {}, guildid))
			.setDisabled(previousButtonsDisabled),
		new MessageButton()
			.setCustomId('zitate/nextPage')
			.setStyle('PRIMARY')
			.setLabel(await lang('NEXT_PAGE', {}, guildid))
			.setDisabled(nextButtonsDisabled),
		new MessageButton()
			.setCustomId('zitate/lastPage')
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
