const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const memeUtil = require('@util/MemeUtil.js');
const lang = require('@lang');

module.exports = {
	async execute(interaction) {
		const guildid = interaction.guild.id;
		const randomMeme = await memeUtil.randomMeme(interaction.guild.id);

		const memeEmbed = new MessageEmbed()
			.setTitle(await lang.getString('MEME_RANDOM', {}, guildid))
			.setDescription(randomMeme.meme)
			.setFooter({ text: `ID: ${randomMeme.id}` })
			.setColor('ORANGE');

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('memes-newRandom')
				.setStyle('PRIMARY')
				.setLabel(await lang.getString('ANOTHER_MEME', {}, guildid))
		);

		interaction.update({
			embeds: [memeEmbed],
			components: [actionRow],
		});
	},
};
