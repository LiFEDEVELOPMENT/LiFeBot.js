import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
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
		.setName('quote')
		.setDescription(
			'Quote command group. Contains subcommands for adding, deleting and displaying quotes'
		)
		.setDMPermission(false);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('random')
			.setDescription('Displays a random quote from your server')
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('add')
			.setDescription("Adds a quote to the bot's quote database")
			.addStringOption((option) =>
				option
					.setName('quote')
					.setDescription('The quote you want to add')
					.setRequired(true)
			)
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('delete')
			.setDescription("Deletes a quote from the bot's database")
			.addIntegerOption((option) =>
				option
					.setName('id')
					.setDescription('The ID of the quote you want to delete')
					.setRequired(true)
			)
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('list')
			.setDescription('Lists all the quotes from your server')
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('import')
			.setDescription('Imports all messages from a channel as quotes')
			.addStringOption((option) =>
				option
					.setName('channelid')
					.setDescription('The ID of the channel you want to import')
					.setRequired(true)
			)
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
			case 'import':
				answer = await importCommand(interaction, guildid);
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
	const quote = escapeMarkdown(interaction.options.getString('quote'));
	const time = Date.now();
	const author = interaction.user.id;

	const quoteID = sqlUtil.createEntry('quotes', guildid, quote, time, author);
	return lang('QUOTE_EXECUTE_ADD_SUCCESS', locale, { ENTRYID: quoteID });
};

const deleteCommand = (interaction) => {
	const locale = interaction.locale;
	const guildid = interaction.guild.id;
	const toDeleteID = interaction.options.getInteger('id');

	if (sqlUtil.deleteEntry('quotes', toDeleteID, guildid) === false)
		return {
			content: lang('QUOTE_EXECUTE_DELETE_ERROR', locale, {
				ENTRYID: toDeleteID,
			}),
			ephemeral: true,
		};

	return lang('QUOTE_EXECUTE_DELETE_SUCCESS', locale, { ENTRYID: toDeleteID });
};

const importCommand = async (interaction) => {
	const locale = interaction.locale;
	const guildid = interaction.guild.id;
	const channelid = interaction.options.getString('channelid');
	const channel = await interaction.guild.channels.cache.get(channelid);

	if (channel.type !== ChannelType.GuildText)
		return {
			content: lang('QUOTE_EXECUTE_IMPORT_NOTEXT', locale),
			ephemeral: true,
		};

	if (channel === undefined)
		return {
			content: lang('QUOTE_EXECUTE_IMPORT_ERROR', locale),
			ephemeral: true,
		};

	interaction.deferReply();

	let messages = await util.fetchAllMessages(channel);

	let messageArray = [];

	for (let message of messages) {
		messageArray.push([
			guildid,
			message.content,
			message.createdTimestamp,
			message.author.id,
		]);
	}

	sqlUtil.createEntries('quotes', ...messageArray);

	return lang('QUOTE_EXECUTE_IMPORT_SUCCESS', locale, {
		CHANNELNAME: channel.name,
	});
};

const listCommand = (interaction) => {
	return util.buildList('quotes', 1, interaction);
};

const randomCommand = async (interaction) => {
	return util.buildRandom('quotes', interaction);
};

export { create, execute };
