import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, Util } from 'discord.js';
import lang from '#util/Lang';
import errorMessage from '#errormessage';

const create = () => {
	const command = new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Announces a message to the public')
		.addStringOption((option) =>
			option
				.setName('announcement')
				.setDescription('The message you want to announce')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option.setName('title').setDescription('The title of your announcement')
		)
		.addRoleOption((option) =>
			option
				.setName('role')
				.setDescription('The role you want to notify about your announcement')
		)
		.setDMPermission(false);

	return command.toJSON();
};

const execute = (interaction) => {
	try {
		const locale = interaction.locale;
		const options = interaction.options;
		const announceMessage = Util.escapeMarkdown(
			options.getString('announcement')
		);
		const roleString = options.getRole('role') ?? ' ';
		const announceTitle = Util.escapeMarkdown(
			options.getString('title') ?? lang('ANNOUNCE_EXECUTE_EMBED_TITLE', locale)
		);

		const announceEmbed = new MessageEmbed()
			.setColor('RED')
			.setTitle(announceTitle)
			.setDescription(announceMessage)
			.setFooter({
				text: interaction.member.displayName,
			})
			.setTimestamp();

		interaction.channel.send({
			content: `${roleString}`,
			embeds: [announceEmbed],
		});

		interaction.reply({
			content: lang('ANNOUNCE_EXECUTE_SUCCESS', locale),
			ephemeral: true,
		});
	} catch (error) {
		errorMessage(interaction, error);
	}
};

export { create, execute };
