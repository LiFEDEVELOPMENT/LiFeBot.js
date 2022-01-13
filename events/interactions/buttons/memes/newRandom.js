import { MessageActionRow, MessageEmbed, MessageButton } from 'discord.js';
import memeUtil from '#util/MemeUtil.js';
import lang from '#lang';

async function execute(interaction) {
	const guildid = interaction.guild.id;
	const randomMeme = await memeUtil.randomMeme(interaction.guild.id);

	const memeEmbed = new MessageEmbed()
		.setTitle(await lang('MEME_RANDOM', {}, guildid))
		.setDescription(randomMeme.meme)
		.setFooter({ text: `ID: ${randomMeme.id}` })
		.setColor('ORANGE');

	const actionRow = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('memes/newRandom')
			.setStyle('PRIMARY')
			.setLabel(await lang('ANOTHER_MEME', {}, guildid))
	);

	interaction.update({
		embeds: [memeEmbed],
		components: [actionRow],
	});
}

export default { execute };
