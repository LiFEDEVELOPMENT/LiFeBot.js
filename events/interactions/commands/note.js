import {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from '@discordjs/builders';
import {
	MessageEmbed,
	MessageActionRow,
	MessageButton,
	Util,
} from 'discord.js';
import noteUtil from '#util/NotesUtil';
import lang from '#lang';
import errorMessage from '#errormessage';

async function create() {
	const command = new SlashCommandBuilder()
		.setName('note')
		.setDescription(
			'Note command group. Contains subcommands for adding, deleting and displaying notes.'
		);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('add')
			.setDescription("Adds a note to the bot's database")
			.addStringOption((option) =>
				option
					.setName('notekey')
					.setDescription('The name for your note.')
					.setRequired(true)
			)
			.addStringOption((option) =>
				option
					.setName('note')
					.setDescription('The note you want to add')
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
}

async function execute(interaction) {
	const locale = interaction.locale;
	try {
		let answer = {
			contet: await lang('ERROR', {}, locale),
			ephemeral: true,
		};

		switch (interaction.options.getSubcommand()) {
			case 'add':
				answer = await addCommand(interaction);
				break;
			case 'delete':
				answer = await deleteCommand(interaction);
				break;
			case 'list':
				answer = await listCommand(interaction);
		}

		if (!interaction.deferred) await interaction.reply(answer);
		else await interaction.editReply(answer);
	} catch (error) {
		errorMessage(interaction, error);
	}
}

async function addCommand(interaction) {
	const locale = interaction.locale;
	const guildid = interaction.guild.id;
	const notekey = Util.escapeMarkdown(interaction.options.getString('notekey'));
	const note = Util.escapeMarkdown(interaction.options.getString('note'));
	const author = interaction.user.id;

	const noteID = await noteUtil.addNote(guildid, notekey, note, author);
	return lang('NOTE_EXECUTE_ADD_SUCCESS', { NOTEID: noteID }, locale);
}

async function deleteCommand(interaction) {
	const locale = interaction.locale;
	const guildid = interaction.guild.id;
	const toDeleteID = interaction.options.getInteger('id');

	if ((await noteUtil.deleteNote(toDeleteID, guildid)) == false)
		return {
			content: await lang(
				'NOTE_EXECUTE_DELETE_ERROR',
				{ NOTEID: toDeleteID },
				locale
			),
			ephemeral: true,
		};

	return await lang(
		'NOTE_EXECUTE_DELETE_SUCCESS',
		{ NOTEID: toDeleteID },
		locale
	);
}

async function listCommand(interaction) {
	const locale = interaction.locale;
	const guildid = interaction.guild.id;
	const query = interaction.options.getString('query');
	let noteList;

	if (query === null) noteList = await noteUtil.charLimitList(guildid);
	else noteList = await noteUtil.charLimitListQuery(guildid, query);

	if (noteList[0] === undefined) {
		let emptyString =
			query === null
				? await lang('NOTE_EXECUTE_LIST_REPLY_NO_NOTES', {}, locale)
				: await lang('NOTE_EXECUTE_LIST_REPLY_NO_NOTES_QUERY', {}, locale);
		return { content: emptyString, ephemeral: true };
	}

	const noteEmbed = new MessageEmbed()
		.setTitle(
			Util.escapeMarkdown(
				await lang(
					'NOTE_EXECUTE_LIST_EMBED_TITLE',
					{ GUILDNAME: interaction.guild.name },
					locale
				)
			)
		)
		.setDescription(noteList[0])
		.setTimestamp();

	const nextButtonsDisabled = !(noteList.length > 1);

	const actionRow = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId(`notes/firstPage-${query}`)
			.setStyle('PRIMARY')
			.setLabel('First page')
			.setDisabled(true),
		new MessageButton()
			.setCustomId(`notes/previousPage-${query}`)
			.setStyle('PRIMARY')
			.setLabel('Previous Page')
			.setDisabled(true),
		new MessageButton()
			.setCustomId(`notes/nextPage-${query}`)
			.setStyle('PRIMARY')
			.setLabel('Next Page')
			.setDisabled(nextButtonsDisabled),
		new MessageButton()
			.setCustomId(`notes/lastPage-${query}`)
			.setStyle('PRIMARY')
			.setLabel('Last Page')
			.setDisabled(nextButtonsDisabled)
	);

	return { embeds: [noteEmbed], components: [actionRow] };
}

export { create, execute };
