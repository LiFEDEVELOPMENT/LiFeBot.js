import lang from '#util/Lang';
import { escapeMarkdown } from 'discord.js';

export default (interaction, error) => {
	const locale = interaction.locale;
	const channelID = '930852152614748190';

	interaction.client.channels.cache.get(channelID).send({
		content: escapeMarkdown(error.stack.toString().substring(0, 2000)),
	});

	interaction.reply({
		content: lang('ERROR', locale),
		ephemeral: true,
	});
};
