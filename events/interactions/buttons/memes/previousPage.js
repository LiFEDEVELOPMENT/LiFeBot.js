const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const memeUtil = require('@util/MemeUtil.js');
const lang = require('@lang');

module.exports = {
	async execute(interaction) {
		const guildid = interaction.guild.id;
		let oldEmbed = interaction.message.embeds[0];
		let title = oldEmbed.title.split(
			await lang.getString('EMBED_TITLE_SPLIT', {}, guildid)
		);
		let memeList = await memeUtil.charLimitList(interaction.guild.id);
		let page = parseInt(title[title.length - 1]) - 2; // 1-indexed at UI, so just take that - 2for index - 1

		page =
			page >= 0 ? (page < memeList.length ? page : memeList.length - 1) : 0;
		const previousButtonsDisabled = !(page > 0);
		const nextButtonsDisabled = !(page < memeList.length - 1);

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
			.setDescription(memeList[page])
			.setTimestamp();

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('memes-firstPage')
				.setStyle('PRIMARY')
				.setLabel(await lang.getString('FIRST_PAGE', {}, guildid))
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId('memes-previousPage')
				.setStyle('PRIMARY')
				.setLabel(await lang.getString('PREVIOUS_PAGE', {}, guildid))
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId('memes-nextPage')
				.setStyle('PRIMARY')
				.setLabel(lang.getString('NEXT_PAGE', {}, guildid))
				.setDisabled(nextButtonsDisabled),
			new MessageButton()
				.setCustomId('memes-lastPage')
				.setStyle('PRIMARY')
				.setLabel(await lang.getString('LAST_PAGE', {}, guildid))
				.setDisabled(nextButtonsDisabled)
		);

		await interaction.message.edit({
			embeds: [newEmbed],
			components: [],
		});

		interaction.update({
			embeds: [newEmbed],
			components: [actionRow],
		});
	},
};
