import {} from 'dotenv/config';
import fs from 'fs';
import sql from '#sql';
import { Client, Intents } from 'discord.js';

// Create a new Client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const events = fs
	.readdirSync('./events')
	.filter((file) => file.endsWith('.js'));

// Open DB-Connection and create necessary tables
(async function () {
	await sql.run(
		'CREATE TABLE IF NOT EXISTS quotes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, guildid BLOB, quote STRING, time STRING, author BLOB)'
	);
	await sql.run(
		'CREATE TABLE IF NOT EXISTS memes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, guildid BLOB, meme STRING)'
	);
	await sql.run(
		'CREATE TABLE IF NOT EXISTS polls(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, open BOOLEAN, guildid BLOB, authorid BLOB, maxAnswers INTEGER, question STRING, answer1 STRING, answer2 STRING, answer3 STRING, answer4 STRING, answer5 STRING, answer6 STRING, answer7 STRING, answer8 STRING, answer9 STRING, answer10 STRING)'
	);
	await sql.run(
		'CREATE TABLE IF NOT EXISTS pollvotes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, pollid INTEGER, userid BLOB, vote INTEGER)'
	);
    await sql.run(
        'CREATE TABLE IF NOT EXISTS notes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, guildid BLOB, noteKey STRING, note STRING, author BLOB)'
    );
})();

(async function () {
	// Check for an event and execute the corresponding file in ./events
	for (let event of events) {
		const eventFile = await import(`#events/${event}`);
		if (eventFile.once)
			client.once(eventFile.name, (...args) => {
				eventFile.execute(...args);
			});
		else
			client.on(eventFile.name, (...args) => {
				eventFile.execute(...args);
			});
	}
})();

// Login with the environment data
client.login(process.env.BOT_TOKEN);
