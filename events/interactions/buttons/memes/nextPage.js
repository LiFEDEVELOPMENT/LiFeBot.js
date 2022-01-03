const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const memeUtil = require('../../../../utility/MemeUtil.js');

module.exports = {
	async execute(interaction) {
		let oldEmbed = interaction.message.embeds[0];
		let title = oldEmbed.title.split('Seite ');
		let memeList = await memeUtil.charLimitList(interaction.guild.id);
		let page = parseInt(title[title.length - 1]); // 1-indexed at UI, so just take that for index + 1

		page =
			page >= 0 ? (page < memeList.length ? page : memeList.length - 1) : 0;
		const previousButtonsDisabled = !(page > 0);
		const nextButtonsDisabled = !(page < memeList.length - 1);

		let newEmbed = new MessageEmbed()
			.setTitle(`${title[0]}Seite ${page + 1}`)
			.setDescription(memeList[page])
			.setTimestamp();

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('memes-firstPage')
				.setStyle('PRIMARY')
				.setLabel('Erste Seite!')
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId('memes-previousPage')
				.setStyle('PRIMARY')
				.setLabel('Vorherige Seite!')
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId('memes-nextPage')
				.setStyle('PRIMARY')
				.setLabel('Nächste Seite!')
				.setDisabled(nextButtonsDisabled),
			new MessageButton()
				.setCustomId('memes-lastPage')
				.setStyle('PRIMARY')
				.setLabel('Letzte Seite!')
				.setDisabled(nextButtonsDisabled)
		);

		interaction.update({
			embeds: [newEmbed],
			components: [actionRow],
		});
	},
};
