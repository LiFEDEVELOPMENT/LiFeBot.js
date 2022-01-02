require('dotenv').config();
const fs = require('fs');
const sql = require('./db/sql.js');
const zitateUtility = require('./utility/ZitatUtil.js');
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
}

initDB();

// Login with the environment data
client.login(process.env.BOT_TOKEN);
