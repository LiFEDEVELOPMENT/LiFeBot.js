import {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from '@discordjs/builders';
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import quoteUtil from '#util/QuoteUtil';
import utilities from '#util/Utilities';
import lang from '#lang';

async function create() {
	const command = new SlashCommandBuilder()
		.setName('quote')
		.setDescription(
			'Quote command group. Contains subcommands for adding, deleting and displaying quotes'
		);

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
}

async function execute(interaction) {
	const locale = interaction.locale;
	try {
		const guildid = interaction.guild.id;
		let answer = {
			content: await lang.get('ERROR', {}, locale),
			ephemeral: true,
		};

		switch (interaction.options.getSubcommand()) {
			case 'add':
				answer = await addCommand(interaction, guildid);
				break;
			case 'delete':
				answer = await deleteCommand(interaction, guildid);
				break;
			case 'import':
				answer = await importCommand(interaction, guildid);
				break;
			case 'list':
				answer = await listCommand(interaction, guildid);
				break;
			case 'random':
				answer = await randomCommand(interaction, guildid);
		}

		if (!interaction.deferred) await interaction.reply(answer);
		else await interaction.editReply(answer);
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR', {}, locale),
			ephemeral: true,
		});
	}
}

async function addCommand(interaction) {
	const locale = interaction.locale;
	try {
		const guildid = interaction.guild.id;
		const quote = interaction.options.getString('quote');
		const time = Date.now();
		const author = interaction.user.id;

		const zitatID = await quoteUtil.addQuote(guildid, quote, time, author);
		return await lang(
			'QUOTE_EXECUTE_ADD_SUCCESS',
			{ QUOTEID: zitatID },
			locale
		);
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR', {}, locale),
			ephemeral: true,
		});
	}
}

async function deleteCommand(interaction) {
	const locale = interaction.locale;
	try {
		const guildid = interaction.guild.id;
		const toDeleteID = interaction.options.getInteger('id');

		if ((await quoteUtil.deleteQuote(toDeleteID, guildid)) == false)
			return {
				content: await lang(
					'QUOTE_EXECUTE_DELETE_ERROR',
					{ QUOTEID: toDeleteID },
					locale
				),
				ephemeral: true,
			};

		return await lang(
			'QUOTE_EXECUTE_DELETE_SUCCESS',
			{ QUOTEID: toDeleteID },
			locale
		);
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR', {}, locale),
			ephemeral: true,
		});
	}
}

async function importCommand(interaction) {
	const locale = interaction.locale;
	try {
		const guildid = interaction.guild.id;
		const channelid = interaction.options.getString('channelid');
		const channel = await interaction.guild.channels.cache.get(channelid);

		if (channel === undefined)
			return {
				content: await lang('QUOTE_EXECUTE_IMPORT_ERROR', {}, locale),
				ephemeral: true,
			};

		interaction.deferReply();

		let messages = await utilities.fetchAllMessages(channel);

		for (let message of messages) {
			await quoteUtil.addQuote(
				guildid,
				message.content,
				message.createdTimestamp,
				message.author.id
			);
		}

		return await lang(
			'QUOTE_EXECUTE_IMPORT_SUCCESS',
			{ CHANNELNAME: channelid },
			locale
		);
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR', {}, locale),
			ephemeral: true,
		});
	}
}

async function listCommand(interaction) {
	const locale = interaction.locale;
	try {
		const guildid = interaction.guild.id;
		let quoteList = await quoteUtil.charLimitList(guildid);

		if (quoteList[0] == undefined)
			return {
				content: await lang('QUOTE_EXECUTE_LIST_REPLY_NO_QUOTES', {}, locale),
				ephemeral: true,
			};

		zitateEmbed = new MessageEmbed()
			.setTitle(
				await lang(
					'QUOTE_EXECUTE_LIST_EMBED_TITLE',
					{ GUILDNAME: interaction.guild.name },
					locale
				)
			)
			.setDescription(quoteList[0])
			.setTimestamp();

		const nextButtonsDisabled = !(quoteList.length > 1);

		actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('zitate/firstPage')
				.setStyle('PRIMARY')
				.setLabel(await lang('FIRST_PAGE', {}, locale))
				.setDisabled(true),
			new MessageButton()
				.setCustomId('zitate/previousPage')
				.setStyle('PRIMARY')
				.setLabel(await lang('PREVIOUS_PAGE', {}, locale))
				.setDisabled(true),
			new MessageButton()
				.setCustomId('zitate/nextPage')
				.setStyle('PRIMARY')
				.setLabel(await lang('NEXT_PAGE', {}, locale))
				.setDisabled(nextButtonsDisabled),
			new MessageButton()
				.setCustomId('zitate/lastPage')
				.setStyle('PRIMARY')
				.setLabel(await lang('LAST_PAGE', {}, locale))
				.setDisabled(nextButtonsDisabled)
		);

		return { embeds: [zitateEmbed], components: [actionRow] };
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR', {}, locale),
			ephemeral: true,
		});
	}
}

async function randomCommand(interaction) {
	const locale = interaction.locale;
	try {
		const guildid = interaction.guild.id;
		let randomQuote = await quoteUtil.randomQuote(interaction.guild.id);
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
			.setTitle(await lang('QUOTE_EXECUTE_RANDOM_EMBED_TITLE', {}, locale))
			.setDescription(randomQuote.zitat)
			.setFooter({
				text: await lang(
					'QUOTE_EXECUTE_RANDOM_EMBED_FOOTER',
					{
						DATE: date,
						CREATOR: quoteCreator.username,
						QUOTEID: randomQuote.id,
					},
					guildid
				),
			})
			.setColor('YELLOW');

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('zitate/newRandom')
				.setStyle('PRIMARY')
				.setLabel(await lang('QUOTE_EXECUTE_RANDOM_BUTTON_TITLE', {}, locale))
		);
		return { embeds: [quoteEmbed], components: [actionRow] };
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR', {}, locale),
			ephemeral: true,
		});
	}
}

export { create, execute };
