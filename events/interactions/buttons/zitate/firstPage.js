const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const zitatUtil = require('@util/ZitatUtil.js');

module.exports = {
	async execute(interaction) {
		let oldEmbed = interaction.message.embeds[0];
		let title = oldEmbed.title.split('Seite ');
		let zitatList = await zitatUtil.charLimitList(interaction.guild.id);
		let page = 0;

		const previousButtonsDisabled = !(page > 0);
		const nextButtonsDisabled = !(page < zitatList.length - 1);

		let newEmbed = new MessageEmbed()
			.setTitle(`${title[0]}Seite ${page + 1}`)
			.setDescription(zitatList[page])
			.setTimestamp();

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('zitate-firstPage')
				.setStyle('PRIMARY')
				.setLabel('Erste Seite!')
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId('zitate-previousPage')
				.setStyle('PRIMARY')
				.setLabel('Vorherige Seite!')
				.setDisabled(previousButtonsDisabled),
			new MessageButton()
				.setCustomId('zitate-nextPage')
				.setStyle('PRIMARY')
				.setLabel('Nächste Seite!')
				.setDisabled(nextButtonsDisabled),
			new MessageButton()
				.setCustomId('zitate-lastPage')
				.setStyle('PRIMARY')
				.setLabel('Letzte Seite!')
				.setDisabled(nextButtonsDisabled)
		);

		await interaction.update({
			embeds: [newEmbed],
			components: [actionRow],
		});
	},
};
