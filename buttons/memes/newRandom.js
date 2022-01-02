const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const memeUtil = require('../../utility/MemeUtil.js');

module.exports = {
	async execute(interaction) {
		let randomMeme = await memeUtil.randomMeme(interaction.guild.id);

		const memeEmbed = new MessageEmbed()
			.setTitle('Zufälliges Meme')
			.setDescription(randomMeme.meme)
			.setFooter(`ID: ${randomMeme.id}`)
			.setColor('ORANGE');

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('memes-newRandom')
				.setStyle('PRIMARY')
				.setLabel('Noch ein Meme!')
		);

		interaction.update({
			embeds: [memeEmbed],
			components: [actionRow],
		});
	},
};
