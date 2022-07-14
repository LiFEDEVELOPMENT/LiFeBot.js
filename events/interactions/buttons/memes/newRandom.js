import { MessageActionRow, MessageEmbed, MessageButton } from 'discord.js';
import memeUtil from '#util/MemeUtil';
import lang from '#util/Lang';
import errorMessage from '#errormessage';

const execute = (interaction) => {
	try {
		const locale = interaction.locale;
		const randomMeme = memeUtil.randomMeme(interaction.guild.id);

		const memeEmbed = new MessageEmbed()
			.setTitle(lang('MEME_EXECUTE_RANDOM_EMBED_TITLE', locale))
			.setDescription(randomMeme.meme.toString())
			.setFooter({ text: `ID: ${randomMeme.id}` })
			.setColor('ORANGE');

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('memes/newRandom')
				.setStyle('PRIMARY')
				.setLabel(lang('MEME_EXECUTE_RANDOM_ANOTHER_MEME', locale))
		);

		interaction.update({
			embeds: [memeEmbed],
			components: [actionRow],
		});
	} catch (error) {
		errorMessage(interaction, error);
	}
};

export { execute };
