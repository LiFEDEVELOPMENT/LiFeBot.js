import sql from '#sql';

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

export default { registerNewPoll, fetchAllMessages };
