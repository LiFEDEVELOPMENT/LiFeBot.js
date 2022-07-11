import sql from '#sql';

async function addMeme(guildid, meme) {
	// Prepares a SQL statement and inserts the given quote into the quotes table of the db
	let preparedSQL = 'INSERT INTO memes (guildid,meme) VALUES (?,?)';
	await sql.run(preparedSQL, [guildid, meme]);

	// Fetches the last (just generated) object of the memes table and retrieves its id.
	let memes = await sql.query('SELECT * FROM memes ORDER BY id DESC LIMIT 1');
	return memes[0].id;
}

async function deleteMeme(id, guildid) {
	if (id < 0) return false;

	// Fetch all memes with a matching guildid and check if the given id matches one
	let matchedMeme = await this.listMemes(guildid);
	if (matchedMeme.filter((meme) => meme.id == id).length < 1) return false;

	await sql.run('DELETE FROM memes WHERE id=?', id);
	return true;
}

async function listMemes(guildid) {
	let memes = await sql.query('SELECT * FROM memes WHERE guildid=?', guildid);
	return memes;
}

async function charLimitList(guildid) {
	let memes = await this.listMemes(guildid);
	let resultArray = [];
	let result = '';
	memes.forEach((element) => {
		if ((result + element.meme.toString()).length > 2000) {
			resultArray.push(result);
			result = '';
		}
		result += '\n\n' + element.meme.toString() + ` **(${element.id})**`;
	});
	if (result != '') resultArray.push(result);
	return resultArray;
}

async function randomMeme(guildid) {
	// Retrieves a list of all memes of the given guild and picks a random one
	let guildMemes = await this.listMemes(guildid);
	let random = Math.floor(Math.random() * guildMemes.length);
	return guildMemes[random];
}

export default { addMeme, deleteMeme, listMemes, charLimitList, randomMeme };
