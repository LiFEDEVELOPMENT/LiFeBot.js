const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const zitatUtil = require('@util/ZitatUtil.js');
const lang = require('@lang');

module.exports = {
	async execute(interaction) {
		const guildid = interaction.guild.id;
		let oldEmbed = interaction.message.embeds[0];
		let title = oldEmbed.title.split(
			await lang.getString('EMBED_TITLE_SPLIT', {}, guildid)
		);
		let zitatList = await zitatUtil.charLimitList(interaction.guild.id);
		let page = parseInt(title[title.length - 1]); // 1-indexed at UI, so just take that for index + 1

		page =
			page >= 0 ? (page < zitatList.length ? page : zitatList.length - 1) : 0;
		const previousButtonsDisabled = !(page > 0);
		const nextButtonsDisabled = !(page < zitatList.length - 1);

		let newEmbed = new MessageEmbed()
			.setTitle(
				await lang.getString(
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
				.setCustomId('zitate-firstPage')
				.setStyle('PRIMARY')
				.setLabel(await lang.getString('FIRST_PAGE', {}, guildid))
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId('zitate-previousPage')
				.setStyle('PRIMARY')
				.setLabel(await lang.getString('PREVIOUS_PAGE', {}, guildid))
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId('zitate-nextPage')
				.setStyle('PRIMARY')
				.setLabel(await lang.getString('NEXT_PAGE', {}, guildid))
				.setDisabled(nextButtonsDisabled),
			new MessageButton()
				.setCustomId('zitate-lastPage')
				.setStyle('PRIMARY')
				.setLabel(await lang.getString('LAST_PAGE', {}, guildid))
				.setDisabled(nextButtonsDisabled)
		);

		interaction.update({
			embeds: [newEmbed],
			components: [actionRow],
		});
	},
};
