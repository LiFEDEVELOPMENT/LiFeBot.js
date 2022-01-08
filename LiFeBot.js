require('module-alias/register');
require('dotenv').config();
const fs = require('fs');
const sql = require('@sql');
const zitateUtility = require('@util/ZitatUtil.js');
const { Client, Collection, Intents } = require('discord.js');

// Create a new Client and fetch all event files
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const eventFiles = fs
	.readdirSync('./events')
	.filter((file) => file.endsWith('.js'));

// Check for an event and execute the corresponding file in ./events
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Open DB-Connection and create necessary tables
async function initDB() {
	await sql.openConnection();
	await sql.run(
		'CREATE TABLE IF NOT EXISTS zitate(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, guildid BLOB, zitat STRING, time STRING, author BLOB)'
	);
	await sql.run(
		'CREATE TABLE IF NOT EXISTS memes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, guildid BLOB, meme STRING)'
	);
	await sql.run(
		'CREATE TABLE IF NOT EXISTS polls(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, open BOOLEAN, guildid BLOB, authorid BLOB, maxAntworten INTEGER, frage STRING, antwort1 STRING, antwort2 STRING, antwort3 STRING, antwort4 STRING, antwort5 STRING, antwort6 STRING, antwort7 STRING, antwort8 STRING, antwort9 STRING, antwort10 STRING)'
	);
	await sql.run(
		'CREATE TABLE IF NOT EXISTS pollvotes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, pollid INTEGER, userid BLOB, vote INTEGER)'
	);
}

initDB();

// Login with the environment data
client.login(process.env.BOT_TOKEN);
