require('dotenv').config();
const fs = require('fs');
const sql = require('./db/sql.js');
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
	await sql.execute(
		'CREATE TABLE IF NOT EXISTS zitate(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, guildid INTEGER, zitat STRING, time STRING, author INTEGER)'
	);
	await sql.execute(
		'CREATE TABLE IF NOT EXISTS memes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, guildid INTEGER, meme STRING)'
	);
	await sql.execute(
		'CREATE TABLE IF NOT EXISTS polls(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, guildid INTEGER, channelid INTEGER, messageid INTEGER, userid INTEGER, answercount INTEGER)'
	);
	await sql.execute(
		'CREATE TABLE IF NOT EXISTS pollvotes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, pollid INTEGER, userid INTEGER, vote INTEGER)'
	);
}

initDB();

// Login with the environment data
client.login(process.env.BOT_TOKEN);
