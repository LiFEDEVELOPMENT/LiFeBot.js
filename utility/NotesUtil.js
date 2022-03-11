import sql from '#sql';

async function addNote(guildid, noteKey, note, author) {
	// Prepares a SQL statement and inserts the given Note with its Key into the notes table of the db
	let preparedSQL =
		'INSERT INTO notes (guildid, noteKey, note, author) VALUES (?,?,?,?)';
	await sql.run(preparedSQL, [guildid, noteKey, note, author]);

	// Fetches the last (just generated) object of the notes table and retrievs its id.
	let notes = await sql.query('SELECT * FROM notes');
	return notes[notes.length - 1].id;
}

async function deleteNote(id, guildid) {
	if (id < 0) return false;

	// Fetch all notes with a matching guildid and check if the given id matches one.
	let matchedNote = await this.listNotes(guildid);
	if (matchedNote.filter((note) => note.id == id).length < 1) return false;

	await sql.run('DELETE FROM notes WHERE id=?', id);
	return true;
}

async function listNotes(guildid) {
	let notes = await sql.query('SELECT * FROM notes');
	return notes.filter((note) => note.guildid == guildid);
}

async function listNotesQuery(guildid, query) {
	let notes = await sql.query(
		'SELECT *, INSTR(noteKey, ?) ksv, INSTR(note, ?) nsv FROM notes WHERE ksv > 0 OR nsv > 0',
		[query, query]
	);
	return notes.filter((note) => note.guildid == guildid);
}

async function charLimitList(guildid) {
	let notes = await this.listNotes(guildid);
	let resultArray = [];
	let result = '';
	notes.forEach((element) => {
		if (
			(result + element.note.toString() + element.noteKey.toString() + 10)
				.length > 2000
		) {
			resultArray.push(result);
			result = '';
		}
		result +=
			'\n\n**' +
			element.noteKey.toString() +
			'**\n' +
			element.note.toString() +
			` **(${element.id})**`;
	});
	if (result != '') resultArray.push(result);
	return resultArray;
}

async function charLimitListQuery(guildid, query) {
	let notes = await this.listNotesQuery(guildid, query);
	let resultArray = [];
	let result = '';
	notes.forEach((element) => {
		if (
			(result + element.note.toString() + element.noteKey.toString() + 10)
				.length > 2000
		) {
			resultArray.push(result);
			result = '';
		}
		result +=
			'\n\n**' +
			element.noteKey.toString() +
			'**\n' +
			element.note.toString() +
			` **(${element.id})**`;
	});
	if (result != '') resultArray.push(result);
	return resultArray;
}

export default {
	addNote,
	deleteNote,
	listNotes,
	listNotesQuery,
	charLimitList,
	charLimitListQuery,
};
