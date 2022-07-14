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
import memeUtil from '#util/MemeUtil';
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

const execute = (interaction) => {
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
				answer = randomCommand(interaction, guildid);
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
	const meme = Util.escapeMarkdown(interaction.options.getString('meme'));

	const memeID = memeUtil.addMeme(guildid, meme);
	return lang('MEME_EXECUTE_ADD_SUCCESS', locale, { MEMEID: memeID });
};

const deleteCommand = (interaction) => {
	const locale = interaction.locale;

	const guildid = interaction.guild.id;
	const toDeleteID = interaction.options.getInteger('id');

	if (memeUtil.deleteMeme(toDeleteID, guildid) === false)
		return {
			content: lang('MEME_EXECUTE_DELETE_ERROR', locale, {
				MEMEID: toDeleteID,
			}),
			ephemeral: true,
		};

	return lang('MEME_EXECUTE_DELETE_SUCCESS', locale, { MEMEID: toDeleteID });
};

const listCommand = (interaction) => {
	const locale = interaction.locale;

	const guildid = interaction.guild.id;
	const memeList = memeUtil.charLimitList(guildid);

	if (memeList[0] === undefined)
		return {
			content: lang('MEME_EXECUTE_LIST_REPLY_NO_MEMES', locale),
			ephemeral: true,
		};

	const memeEmbed = new MessageEmbed()
		.setTitle(
			Util.escapeMarkdown(
				lang('MEME_EXECUTE_LIST_EMBED_TITLE', locale, {
					GUILDNAME: interaction.guild.name,
				})
			)
		)
		.setDescription(memeList[0])
		.setTimestamp();

	const nextButtonsDisabled = !(memeList.length > 1);

	const actionRow = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('memes/firstPage')
			.setStyle('PRIMARY')
			.setLabel(lang('FIRST_PAGE', locale))
			.setDisabled(true),
		new MessageButton()
			.setCustomId('memes/previousPage')
			.setStyle('PRIMARY')
			.setLabel(lang('PREVIOUS_PAGE', locale))
			.setDisabled(true),
		new MessageButton()
			.setCustomId('memes/nextPage')
			.setStyle('PRIMARY')
			.setLabel(lang('NEXT_PAGE', locale))
			.setDisabled(nextButtonsDisabled),
		new MessageButton()
			.setCustomId('memes/lastPage')
			.setStyle('PRIMARY')
			.setLabel(lang('LAST_PAGE', locale))
			.setDisabled(nextButtonsDisabled)
	);

	return { embeds: [memeEmbed], components: [actionRow] };
};

const randomCommand = (interaction) => {
	const locale = interaction.locale;

	const guildid = interaction.guild.id;
	const randomMeme = memeUtil.randomMeme(guildid);

	if (randomMeme === undefined)
		return {
			content: lang('MEME_EXECUTE_LIST_REPLY_NO_MEMES', locale),
			ephemeral: true,
		};

	const memeEmbed = new MessageEmbed()
		.setTitle(lang('MEME_EXECUTE_RANDOM_EMBED_TITLE', locale))
		.setDescription(randomMeme.meme.toString())
		.setFooter({
			text: lang('MEME_EXECUTE_RANDOM_EMBED_FOOTER', locale, {
				MEMEID: randomMeme.id,
			}),
		})
		.setColor('ORANGE');

	const actionRow = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('memes/newRandom')
			.setStyle('PRIMARY')
			.setLabel(lang('MEME_EXECUTE_RANDOM_ANOTHER_MEME', locale))
	);
	return { embeds: [memeEmbed], components: [actionRow] };
};

export { create, execute };
