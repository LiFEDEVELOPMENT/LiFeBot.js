const fs = require('fs');
require('dotenv').config();
const sql = require('./sql.js');
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
const initDB = async () => {
	await sql.openConnection();
	await sql.execute(
		'CREATE TABLE IF NOT EXISTS memes (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, guildid INTEGER, meme STRING)'
	);

	await sql.execute('INSERT INTO memes (guildid,meme) VALUES (42,"Test")');

	let queryResults = await sql.query('SELECT * from memes');

	console.log(queryResults);

	// Login with the environment data
	client.login(process.env.BOT_TOKEN);
};
initDB();
