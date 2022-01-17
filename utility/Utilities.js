import sql from '#sql';

async function registerNewPoll(
	guildid,
	authorid,
	maxAnswers,
	frage,
	antwort1,
	antwort2,
	antwort3,
	antwort4,
	antwort5,
	antwort6,
	antwort7,
	antwort8,
	antwort9,
	antwort10
) {
	// Prepare arguments for sql statement
	let sqlParams = Array.from(arguments);

	// Prepaare sql statement and run it with prepared arguments
	let preparedSQL =
		'INSERT INTO polls (guildid,authorid,maxAnswers,frage,antwort1,antwort2,antwort3,antwort4,antwort5,antwort6,antwort7,antwort8,antwort9,antwort10) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	await sql.run(preparedSQL, sqlParams);

	// Return the id of the newly generated poll-entry
	let sqlResult = await sql.query('SELECT * FROM polls');
	return sqlResult[sqlResult.length - 1].id;
}

async function fetchAllMessages(
	channel,
	options = {
		reverseArray: true,
		userOnly: false,
		botOnly: false,
		pinnedOnly: false,
	}
) {
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
}

export default { registerNewPoll, fetchAllMessages };
