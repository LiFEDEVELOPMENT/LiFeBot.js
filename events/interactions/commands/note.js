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
import noteUtil from '#util/NoteUtil';
import errorMessage from '#errormessage';
import NotesUtil from '../../../utility/NotesUtil';

async function create() {
    const command = new SlashCommandBuilder()
        .setName('note')
        .setDescription(
            'Note command group. COntains subcommands for adding deleting and displaying quotes.'
        );

    command.addSubcommand(
        new SlashCommandSubcommandBuilder()
            .setName('add')
            .setDescription("Adds a note to the bot's database")
            .addStringOption((option) => 
                option
                    .setName('noteKey')
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
            .setDescription("Deletes a note from the Bot's database")
            .addIntegerOption((option) =>
                option
                    .setName('id')
                    .setDescription('THe ID of the note you want to delete')
                    .setRequired(true)
            )
    );

    command.addSubcommand(
        new SlashCommandSubcommandBuilder()
            .setName('list')
            .setDescription('Lists all the notes from your server')
            .addStringOption((option) =>
                option
                    .setName('noteKey')
                    .setDescription('List all the notes from your server for the givven noteKey')
                    .setRequired(false)
            )
    );
    return command.toJSON();
}

async function execute(interaction) {
    const locale = interaction.locale;
    try {
        const guildid = interaction.guild.id;
        let answer = {
            contet: await lang('ERROR', {}, locale),
            ephemeral: true,
        };

        switch (interaction.option.getSubCommand()) {
            case 'add':
                answer = await addCommand(interaction, guildid);
                break;
            case 'delete':
                answer = await deleteCommand(interaction, guildid);
                break;
            case 'list':
                answer = await listCommand(interaction, guildid);
        }

        if(!interaction.deferred) await interaction.reply(answer);
        else await interaction.editReply(answer);
    } catch (error) {
        errorMessage(interaction, error);
    }
}

async function addCommand(interaction) {
    // const locale = interaction.locale;
    const guildid = interaction.guild.id;
    const noteKey = Util.escapeMarkdown(interaction.options.getString('noteKey'));
    const note = Util.escapeMarkdown(interaction.options.getString('note'));
    const author = interaction.user.id;

    const noteID = await NoteUtil.addNote(guildid, noteKey, note, author);
    return 'Note addes successfully';
}

async function deleteCommand(interaction) {
    // const locale = interaction.locale;
    const guildid = interaction.guild.id;
    const toDeleteID = interaction.options.getString('id');

    if((await NotesUtil.deleteNote(toDeleteID, guildid)) == false)
        return {
            content: 'Note with ID cannot be deleted',
            ephemeral: true,
        };
    
    return 'Note was successfully added.'   
}

async function listCommand(interaction) {
    const guildid = interaction.guild.id;
    const key = interaction.options.getString('noteKey');

    let noteList = await NotesUtil.charLimitList(guildid);

    if (key != undefined) noteList = await NotesUtil.charLimitListKey(guildid, key);

    if(noteList[0] == undefined)
        return {
            content: 'No matching notes were found',
            ephemeral: true
        };

    const noteEmbed = new MessageEmbed()
        .setTitle(
            Util.escapeMarkdown(
                'All notes from GUILDNAME', {GUILDNAME: interaction.guild.name}
            )
        )
        .setDescription(noteList[0])
        .setTimestamp();

    const nextButtonsDisabled = !(noteList.length > 1);

    const actionRow = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId('notes/firstPage')
        .setStyle('PRIMARY')
        .setLabel('First page')
        .setDisabled(true),
    new MessageButton()
        .setCustomId('notes/previousPage')
        .setStyle('PRIMARY')
        .setLabel('Previous Page')
        .setDisabled(true),
    new MessageButton()
        .setCustomId('notes/mextPage')
        .setStyle('PRIMARY')
        .setLabel('Next Page')
        .setDisabled(nextButtonsDisabled),
    new MessageButton()
        .setCustomId('notes(lastPage')
        .setStyle('PRIMARY')
        .setLabel('Last Page')
        .setDisabled(nextButtonsDisabled)
    );

    return { embeds: [noteEmbed], components: [actionRow] };
}

