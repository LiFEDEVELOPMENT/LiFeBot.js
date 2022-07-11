import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, Util } from 'discord.js';
import lang from '#lang';
import errorMessage from '#errormessage';

async function create() {
	const command = new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Announces a message to the public')
		.addStringOption((option) =>
			option
				.setName('message')
				.setDescription('The message you want to announce')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option.setName('title').setDescription('The title of your message')
		)
		.addRoleOption((option) =>
			option
				.setName('role')
				.setDescription('The role you want to notify about your announcement')
		)
		.setDMPermission(false);

	return command.toJSON();
}
async function execute(interaction) {
	const locale = interaction.locale;
	try {
		const options = interaction.options;
		const announceMessage = Util.escapeMarkdown(options.getString('message'));
		const roleString = options.getRole('role') ?? ' ';
		const announceTitle = Util.escapeMarkdown(
			options.getString('title') ??
				(await lang('ANNOUNCE_EXECUTE_EMBED_TITLE', {}, locale))
		);

		const announceEmbed = new MessageEmbed()
			.setColor('RED')
			.setTitle(announceTitle)
			.setDescription(announceMessage)
			.setFooter({
				text: interaction.member.displayName,
			})
			.setTimestamp();

		await interaction.channel.send({
			content: `${roleString}`,
			embeds: [announceEmbed],
		});

		await interaction.reply({
			content: await lang('ANNOUNCE_EXECUTE_SUCCESS', {}, locale),
			ephemeral: true,
		});
	} catch (error) {
		errorMessage(interaction, error);
	}
}

export { create, execute };
