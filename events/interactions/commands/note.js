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
import lang from '#util/Lang';

import errorMessage from '#errormessage';

const create = () => {
	const command = new SlashCommandBuilder()
		.setName('note')
		.setDescription(
			'Note command group. Contains subcommands for adding, deleting and displaying notes.'
		)
		.setDMPermission(false);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('add')
			.setDescription("Adds a note to the bot's database")
			.addStringOption((option) =>
				option
					.setName('notekey')
					.setDescription('The subject of your note.')
					.setRequired(true)
			)
			.addStringOption((option) =>
				option
					.setName('note')
					.setDescription('The note you want to add.')
					.setRequired(true)
			)
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('delete')
			.setDescription("Deletes a note from the bot's database")
			.addIntegerOption((option) =>
				option
					.setName('id')
					.setDescription('The ID of the note you want to delete')
					.setRequired(true)
			)
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('list')
			.setDescription('Lists all the notes from your server')
			.addStringOption((option) =>
				option
					.setName('query')
					.setDescription(
						'Lists all notes from your server for the given note-key'
					)
					.setRequired(false)
			)
	);

	return command.toJSON();
};

const execute = (interaction) => {
	try {
		const locale = interaction.locale;
		let answer = {
			contet: lang('ERROR', locale),
			ephemeral: true,
		};

		switch (interaction.options.getSubcommand()) {
			case 'add':
				answer = addCommand(interaction);
				break;
			case 'delete':
				answer = deleteCommand(interaction);
				break;
			case 'list':
				answer = listCommand(interaction);
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
	const notekey = escapeMarkdown(interaction.options.getString('notekey'));
	const note = escapeMarkdown(interaction.options.getString('note'));
	const author = interaction.user.id;

	const noteID = sqlUtil.createEntry('notes', guildid, notekey, note, author);
	return lang('NOTE_EXECUTE_ADD_SUCCESS', locale, { NOTEID: noteID });
};

const deleteCommand = (interaction) => {
	const locale = interaction.locale;
	const guildid = interaction.guild.id;
	const toDeleteID = interaction.options.getInteger('id');

	if (sqlUtil.deleteEntry('notes', toDeleteID, guildid) === false)
		return {
			content: lang('NOTE_EXECUTE_DELETE_ERROR', locale, {
				NOTEID: toDeleteID,
			}),
			ephemeral: true,
		};

	return lang('NOTE_EXECUTE_DELETE_SUCCESS', locale, { NOTEID: toDeleteID });
};

const listCommand = (interaction) => {
	const locale = interaction.locale;
	const guildid = interaction.guild.id;
	const query = interaction.options.getString('query');
	let noteList = sqlUtil.charLimitList('notes', guildid, query);

	if (noteList[0] === undefined) {
		let emptyString =
			query === null
				? lang('NOTE_EXECUTE_LIST_REPLY_NO_NOTES', locale)
				: lang('NOTE_EXECUTE_LIST_REPLY_NO_NOTES_QUERY', locale);
		return { content: emptyString, ephemeral: true };
	}

	const noteEmbed = new EmbedBuilder()
		.setTitle(
			escapeMarkdown(
				lang('NOTE_EXECUTE_LIST_EMBED_TITLE', locale, {
					GUILDNAME: interaction.guild.name,
				})
			)
		)
		.setDescription(noteList[0])
		.setTimestamp();

	const nextButtonsDisabled = !(noteList.length > 1);

	const actionRow = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(`notes/firstPage-${query}`)
			.setStyle(ButtonStyle.Primary)
			.setLabel('First page')
			.setDisabled(true),
		new ButtonBuilder()
			.setCustomId(`notes/previousPage-${query}`)
			.setStyle(ButtonStyle.Primary)
			.setLabel('Previous Page')
			.setDisabled(true),
		new ButtonBuilder()
			.setCustomId(`notes/nextPage-${query}`)
			.setStyle(ButtonStyle.Primary)
			.setLabel('Next Page')
			.setDisabled(nextButtonsDisabled),
		new ButtonBuilder()
			.setCustomId(`notes/lastPage-${query}`)
			.setStyle(ButtonStyle.Primary)
			.setLabel('Last Page')
			.setDisabled(nextButtonsDisabled)
	);

	return { embeds: [noteEmbed], components: [actionRow] };
};

export { create, execute };
