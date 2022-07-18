import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	escapeMarkdown,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from 'discord.js';
import sqlUtil from '#util/SQLUtil';
import util from '#util/Utilities';
import lang from '#util/Lang';

import errorMessage from '#errormessage';

const create = () => {
	const command = new SlashCommandBuilder()
		.setName('meme')
		.setDescription(
			'Meme command group. Contains subcommands for adding, deleting and displaying memes'
		)
		.setDMPermission(false);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('random')
			.setDescription('Displays a random meme from your server')
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('add')
			.setDescription("Adds a meme to the bot's meme database")
			.addStringOption((option) =>
				option
					.setName('meme')
					.setDescription('The meme you want to add')
					.setRequired(true)
			)
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('delete')
			.setDescription("Deletes a meme from the bot's database")
			.addIntegerOption((option) =>
				option
					.setName('id')
					.setDescription('The ID of the meme you want to delete')
					.setRequired(true)
			)
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('list')
			.setDescription('Lists all the memes from your server')
	);

	return command.toJSON();
};

const execute = async (interaction) => {
	try {
		const locale = interaction.locale;
		const guildid = interaction.guild.id;
		let answer = {
			content: lang('ERROR', locale),
			ephemeral: true,
		};

		switch (interaction.options.getSubcommand()) {
			case 'add':
				answer = addCommand(interaction, guildid);
				break;
			case 'delete':
				answer = deleteCommand(interaction, guildid);
				break;
			case 'list':
				answer = listCommand(interaction, guildid);
				break;
			case 'random':
				answer = await randomCommand(interaction, guildid);
		}

		if (!interaction.deferred) interaction.reply(answer);
		else interaction.editReply(answer);
	} catch (error) {
		errorMessage(interaction, error);
	}
};

const addCommand = (interaction) => {
	const locale = interaction.locale;

	const guildid = interaction.guild.id;
	const meme = escapeMarkdown(interaction.options.getString('meme'));

	const memeID = sqlUtil.createEntry('memes', guildid, meme);
	return lang('MEME_EXECUTE_ADD_SUCCESS', locale, { ENTRYID: memeID });
};

const deleteCommand = (interaction) => {
	const locale = interaction.locale;

	const guildid = interaction.guild.id;
	const toDeleteID = interaction.options.getInteger('id');

	if (sqlUtil.deleteEntry('memes', toDeleteID, guildid) === false)
		return {
			content: lang('MEME_EXECUTE_DELETE_ERROR', locale, {
				ENTRYID: toDeleteID,
			}),
			ephemeral: true,
		};

	return lang('MEME_EXECUTE_DELETE_SUCCESS', locale, { ENTRYID: toDeleteID });
};

const listCommand = (interaction) => {
	return util.buildList('memes', 1, interaction);
};

const randomCommand = (interaction) => {
	return util.buildRandom('memes', interaction);
};

export { create, execute };
