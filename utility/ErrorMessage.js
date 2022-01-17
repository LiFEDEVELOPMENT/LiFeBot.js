import { Util } from 'discord.js';
import lang from '#lang';

export default async function sendMessage(interaction, error) {
	const locale = interaction.locale;
	const channel = '930852152614748190';

	interaction.client.channels.cache
		.get(channel)
		.send({ content: Util.escapeMarkdown(error.toString()) });

	interaction.reply({
		content: await lang('ERROR', {}, locale),
		ephemeral: true,
	});
}
