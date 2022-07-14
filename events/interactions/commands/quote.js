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
import quoteUtil from '#util/QuoteUtil';
import utilities from '#util/Utilities';
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
	const quote = Util.escapeMarkdown(interaction.options.getString('quote'));
	const time = Date.now();
	const author = interaction.user.id;

	const quoteID = quoteUtil.addQuote(guildid, quote, time, author);
	return lang('QUOTE_EXECUTE_ADD_SUCCESS', locale, { QUOTEID: quoteID });
};

const deleteCommand = (interaction) => {
	const locale = interaction.locale;
	const guildid = interaction.guild.id;
	const toDeleteID = interaction.options.getInteger('id');

	if (quoteUtil.deleteQuote(toDeleteID, guildid) === false)
		return {
			content: lang('QUOTE_EXECUTE_DELETE_ERROR', locale, {
				QUOTEID: toDeleteID,
			}),
			ephemeral: true,
		};

	return lang('QUOTE_EXECUTE_DELETE_SUCCESS', locale, { QUOTEID: toDeleteID });
};

const importCommand = async (interaction) => {
	const locale = interaction.locale;
	const guildid = interaction.guild.id;
	const channelid = interaction.options.getString('channelid');
	const channel = await interaction.guild.channels.cache.get(channelid);

	if (!channel.isText())
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

	let messages = await utilities.fetchAllMessages(channel);

	for (let message of messages) {
		quoteUtil.addQuote(
			guildid,
			message.content,
			message.createdTimestamp,
			message.author.id
		);
	}

	return lang('QUOTE_EXECUTE_IMPORT_SUCCESS', locale, {
		CHANNELNAME: channel.name,
	});
};

const listCommand = (interaction) => {
	const locale = interaction.locale;

	const guildid = interaction.guild.id;
	let quoteList = quoteUtil.charLimitList(guildid);

	if (quoteList[0] === undefined)
		return {
			content: lang('QUOTE_EXECUTE_LIST_REPLY_NO_QUOTES', locale),
			ephemeral: true,
		};

	const quoteEmbed = new MessageEmbed()
		.setTitle(
			Util.escapeMarkdown(
				lang('QUOTE_EXECUTE_LIST_EMBED_TITLE', locale, {
					GUILDNAME: interaction.guild.name,
				})
			)
		)
		.setDescription(quoteList[0])
		.setTimestamp();

	const nextButtonsDisabled = !(quoteList.length > 1);

	const actionRow = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('quotes/firstPage')
			.setStyle('PRIMARY')
			.setLabel(lang('FIRST_PAGE', locale))
			.setDisabled(true),
		new MessageButton()
			.setCustomId('quotes/previousPage')
			.setStyle('PRIMARY')
			.setLabel(lang('PREVIOUS_PAGE', locale))
			.setDisabled(true),
		new MessageButton()
			.setCustomId('quotes/nextPage')
			.setStyle('PRIMARY')
			.setLabel(lang('NEXT_PAGE', locale))
			.setDisabled(nextButtonsDisabled),
		new MessageButton()
			.setCustomId('quotes/lastPage')
			.setStyle('PRIMARY')
			.setLabel(lang('LAST_PAGE', locale))
			.setDisabled(nextButtonsDisabled)
	);

	return { embeds: [quoteEmbed], components: [actionRow] };
};

const randomCommand = async (interaction) => {
	const locale = interaction.locale;

	let randomQuote = quoteUtil.randomQuote(interaction.guild.id);
	if (randomQuote === undefined)
		return {
			content: lang('QUOTE_EXECUTE_LIST_REPLY_NO_QUOTES', locale),
			ephemeral: true,
		};

	let quoteCreator = await interaction.client.users
		.fetch(randomQuote.author)
		.catch(() => {
			return {
				username: 'n/a',
			};
		});
	let date = new Date(randomQuote.time).toLocaleDateString('de-DE', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});

	const quoteEmbed = new MessageEmbed()
		.setTitle(lang('QUOTE_EXECUTE_RANDOM_EMBED_TITLE', locale))
		.setDescription(randomQuote.quote.toString())
		.setFooter({
			text: lang('QUOTE_EXECUTE_RANDOM_EMBED_FOOTER', locale, {
				DATE: date,
				CREATOR: quoteCreator.username,
				QUOTEID: randomQuote.id,
			}),
		})
		.setColor('YELLOW');

	const actionRow = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('quotes/newRandom')
			.setStyle('PRIMARY')
			.setLabel(lang('QUOTE_EXECUTE_RANDOM_BUTTON_TITLE', locale))
	);
	return { embeds: [quoteEmbed], components: [actionRow] };
};

export { create, execute };
