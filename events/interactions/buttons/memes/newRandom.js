import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} from 'discord.js';
import sqlUtil from '#util/SQLUtil';
import lang from '#util/Lang';
import errorMessage from '#errormessage';

const execute = (interaction) => {
	try {
		const locale = interaction.locale;
		const randomMeme = sqlUtil.randomEntry('memes', interaction.guild.id);

		const memeEmbed = new EmbedBuilder()
			.setTitle(lang('MEME_EXECUTE_RANDOM_EMBED_TITLE', locale))
			.setDescription(randomMeme.meme.toString())
			.setFooter({ text: `ID: ${randomMeme.id}` })
			.setColor('Orange');

		const actionRow = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('memes/newRandom')
				.setStyle(ButtonStyle.Primary)
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
