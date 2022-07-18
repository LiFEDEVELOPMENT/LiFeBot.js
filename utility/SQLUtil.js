import sql from '#sql';

const createEntry = (type, ...args) => {
	let preparedSQL = {
		memes: 'INSERT INTO memes (guildid,meme) VALUES (?,?)',
		notes: 'INSERT INTO notes (guildid,noteKey,note,author) VALUES (?,?,?,?)',
		quotes: 'INSERT INTO quotes (guildid,quote,time,author) VALUES (?,?,?,?)',
		querySQL: `SELECT * FROM ${type} ORDER BY id DESC LIMIT 1`,
	};

	sql.run(preparedSQL[type], args);

	let createdObject = sql.query(preparedSQL['querySQL']);

	return createdObject[0].id;
};

const deleteEntry = (type, id, guildid) => {
	let preparedSQL = {
		memes: 'DELETE FROM memes WHERE id = ?',
		notes: 'DELETE FROM notes WHERE id = ?',
		quotes: 'DELETE FROM quotes WHERE id = ?',
		querySQL: `SELECT * FROM ${type} WHERE id = ? AND guildid = ?`,
	};

	if (id < 0) return false;

	let matchedEntry = sql.query(preparedSQL['querySQL'], [id, guildid]);
	if (matchedEntry.length < 1) return false;

	sql.run(preparedSQL[type], [id]);
	return true;
};

const listEntries = (type, guildid, query) => {
	let preparedSQL = {
		memes: 'SELECT * FROM memes WHERE guildid = ?',
		notes: 'SELECT * FROM notes WHERE guildid = ?',
		quotes: 'SELECT * FROM quotes WHERE guildid = ?',
		noteWithQuery:
			'SELECT *, INSTR(noteKey, ?) ksv, INSTR(note, ?) nsv FROM notes WHERE ksv > 0 OR nsv > 0',
	};

	if (query) return sql.query(preparedSQL[noteWithQuery], [query, query]);
	return sql.query(preparedSQL[type], [guildid]);
};

const charLimitList = (type, guildid, query) => {
	let results = listEntries(type, guildid, query);
	let resultArray = [];
	let result = '';

	type = type.substring(0, type.length - 1);

	results.forEach((entry) => {
		if (type === 'note') {
			if (
				(result + entry.noteKey.toString() + entry.note.toString()).length >=
				1985
			) {
				resultArray.push(result);
				result = '';
			}
			result += `\n\n**${entry.noteKey}**\n${entry.note} **(${entry.id})**`;
		} else {
			if ((result + entry[type].toString()).length >= 1985) {
				resultArray.push(result);
				result = '';
			}
			result += `\n\n${entry[type]} **(${entry.id})**`;
		}
	});

	if (result.length > 0) resultArray.push(result);
	return resultArray;
};

const randomEntry = (type, guildid) => {
	const entries = listEntries(type, guildid);
	const random = Math.floor(Math.random() * entries.length);
	return entries[random];
};

export default {
	createEntry,
	deleteEntry,
	listEntries,
	charLimitList,
	randomEntry,
};
