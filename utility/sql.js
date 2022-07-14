import Database from 'better-sqlite3';
const db = new Database('./db/LiFeDB.db');

function initialize() {
	run(
		'CREATE TABLE IF NOT EXISTS quotes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, guildid BLOB, quote STRING, time STRING, author BLOB)'
	);
	run(
		'CREATE TABLE IF NOT EXISTS memes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, guildid BLOB, meme STRING)'
	);
	run(
		'CREATE TABLE IF NOT EXISTS polls(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, open BOOLEAN, guildid BLOB, authorid BLOB, maxAnswers INTEGER, question STRING, answer1 STRING, answer2 STRING, answer3 STRING, answer4 STRING, answer5 STRING, answer6 STRING, answer7 STRING, answer8 STRING, answer9 STRING, answer10 STRING)'
	);
	run(
		'CREATE TABLE IF NOT EXISTS pollvotes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, pollid INTEGER, userid BLOB, vote INTEGER)'
	);
	run(
		'CREATE TABLE IF NOT EXISTS notes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, guildid BLOB, noteKey STRING, note STRING, author BLOB)'
	);
}

function query(sql, placeholders = []) {
	return db.prepare(sql).all(placeholders);
}

function run(sql, placeholders = []) {
	db.prepare(sql).run(placeholders);
}

export default { initialize, query, run };
