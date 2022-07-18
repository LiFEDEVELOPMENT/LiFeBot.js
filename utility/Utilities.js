import sql from '#sql';
import sqlUtil from '#util/SQLUtil';
import lang from '#util/Lang';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	escapeMarkdown,
} from 'discord.js';

const registerNewPoll = (...args) => {
	// Prepaare sql statement and run it with prepared arguments
	let preparedSQL =
		'INSERT INTO polls (guildid,authorid,maxAnswers,question,answer1,answer2,answer3,answer4,answer5,answer6,answer7,answer8,answer9,answer10) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	sql.run(preparedSQL, args);

	// Return the id of the newly generated poll-entry
	let sqlResult = sql.query('SELECT * FROM polls');
	return sqlResult[sqlResult.length - 1].id;
};

const fetchAllMessages = async (
	channel,
	options = {
		reverseArray: true,
		userOnly: false,
		botOnly: false,
		pinnedOnly: false,
	}
) => {
	//https://github.com/iColtz/discord-fetch-all
	const { reverseArray, userOnly, botOnly, pinnedOnly } = options;
	let messages = [];
	let lastID;
	while (true) {
		const fetchedMessages = await channel.messages.fetch({
			limit: 100,
			...(lastID && { before: lastID }),
		});

		if (fetchedMessages.size === 0) {
			if (reverseArray) {
				messages = messages.reverse();
			}
			if (userOnly) {
				messages = messages.filter((msg) => !msg.author.bot);
			}
			if (botOnly) {
				messages = messages.filter((msg) => msg.author.bot);
			}
			if (pinnedOnly) {
				messages = messages.filter((msg) => msg.pinned);
			}
			return messages;
		}
		messages = messages.concat(Array.from(fetchedMessages.values()));
		lastID = fetchedMessages.lastKey();
	}
};

const buildList = (type, page, interaction, query) => {
	const locale = interaction.locale;
	const guildid = interaction.guild.id;
	const list = sqlUtil.charLimitList(type, guildid, query);

	if (list.length === 0)
		if (query)
			return {
				content: lang(`${type.toUpperCase()}_NO_ENTRIES_QUERY`, locale),
				ephemeral: true,
			};
		else
			return {
				content: lang(`${type.toUpperCase()}_NO_ENTRIES`, locale),
				ephemeral: true,
			};

	const pageIndex = ((page) => {
		if (page >= 0) return page - 1;
		return (page + list.length) % (list.length + 1);
	})(page);

	const embed = new EmbedBuilder()
		.setTitle(
			escapeMarkdown(
				lang(`${type.toUpperCase()}_LIST_TITLE`, locale, {
					GUILDNAME: interaction.guild.name,
					INDEX: pageIndex + 1,
				})
			)
		)
		.setDescription(list[pageIndex])
		.setTimestamp();

	const prevButtonsDisabled = !(pageIndex > 0);
	const nextButtonsDisabled = !(list.length > pageIndex + 1);

	const suffix = query ? `-${query}` : '';

	const actionRow = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(`${type}/firstPage${suffix}`)
			.setStyle(ButtonStyle.Primary)
			.setLabel(lang('FIRST_PAGE', locale))
			.setDisabled(prevButtonsDisabled),
		new ButtonBuilder()
			.setCustomId(`${type}/prevPage-${pageIndex}${suffix}`)
			.setStyle(ButtonStyle.Primary)
			.setLabel(lang('PREV_PAGE', locale))
			.setDisabled(prevButtonsDisabled),
		new ButtonBuilder()
			.setCustomId(`${type}/nextPage-${pageIndex + 2}${suffix}`)
			.setStyle(ButtonStyle.Primary)
			.setLabel(lang('NEXT_PAGE', locale))
			.setDisabled(nextButtonsDisabled),
		new ButtonBuilder()
			.setCustomId(`${type}/lastPage${suffix}`)
			.setStyle(ButtonStyle.Primary)
			.setLabel(lang('LAST_PAGE', locale))
			.setDisabled(nextButtonsDisabled)
	);

	return { embeds: [embed], components: [actionRow] };
};

const buildRandom = async (type, interaction) => {
	const locale = interaction.locale;
	const guildid = interaction.guild.id;
	const random = sqlUtil.randomEntry(type, guildid);

	if (!random)
		return {
			content: lang(`${type.toUpperCase()}_NO_ENTRIES`, locale),
			ephemeral: true,
		};

	let creator, date;
	creator = { username: '' };

	if (random.author) {
		creator = await interaction.client.users.fetch(random.author).catch(() => {
			return {
				username: 'n/a',
			};
		});
	}

	if (random.time) {
		date = new Date(random.time).toLocaleDateString('de-DE', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	}

	let footer = lang(`${type.toUpperCase()}_RANDOM_FOOTER`, locale, {
		DATE: date,
		CREATOR: creator.username,
		ENTRYID: random.id,
	});

	const embed = new EmbedBuilder()
		.setTitle(lang(`${type.toUpperCase()}_RANDOM_TITLE`, locale))
		.setDescription(random[type.slice(0, -1)].toString())
		.setFooter({ text: footer })
		.setColor('Orange');

	const actionRow = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(`${type}/newRandom`)
			.setStyle(ButtonStyle.Primary)
			.setLabel(lang(`${type.toUpperCase()}_NEW_RANDOM`, locale))
	);

	return { embeds: [embed], components: [actionRow] };
};

export default { buildList, buildRandom, fetchAllMessages, registerNewPoll };
