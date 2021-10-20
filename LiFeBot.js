const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
require('dotenv').config();

// Create a new Client and fetch all event files
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// Check for an event and execute the corresponding file in ./events
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Login with the environment data
client.login(process.env.BOT_TOKEN);