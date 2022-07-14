import sql from '#sql';

const addQuote = (guildid, quote, time, author) => {
	// Prepares a SQL statement and inserts the given quote into the quotes table of the db
	let preparedSQL =
		'INSERT INTO quotes (guildid,quote,time,author) VALUES (?,?,?,?)';
	sql.run(preparedSQL, [guildid, quote, time.toString(), author]);

	// Fetches the last (just generated) object of the quotes table and retrieves its id.
	let quotes = sql.query('SELECT * FROM quotes ORDER BY id DESC LIMIT 1');
	return quotes[0].id;
};

const deleteQuote = (id, guildid) => {
	if (id < 0) return false;

	// Fetch all quotes with a matching guildid and check if the given id matches one
	let matchedQuote = listQuotes(guildid);
	if (matchedQuote.filter((quote) => quote.id === id).length < 1) return false;

	sql.run('DELETE FROM quotes WHERE id=?', id);
	return true;
};

const listQuotes = (guildid) => {
	let quotes = sql.query('SELECT * FROM quotes WHERE guildid=?', guildid);
	return quotes;
};

const charLimitList = (guildid) => {
	let quotes = listQuotes(guildid);
	let resultArray = [];
	let result = '';
	quotes.forEach((element) => {
		if ((result + element.quote.toString()).length > 2000) {
			resultArray.push(result);
			result = '';
		}
		result += '\n\n' + element.quote.toString() + ` **(${element.id})**`;
	});
	if (result != '') resultArray.push(result);
	return resultArray;
};

const randomQuote = (guildid) => {
	// Retrieves a list of all quotes of the given guild and picks a random one
	const guildQuotes = listQuotes(guildid);
	const random = Math.floor(Math.random() * guildQuotes.length);
	return guildQuotes[random];
};

export default {
	addQuote,
	deleteQuote,
	listQuotes,
	charLimitList,
	randomQuote,
};
