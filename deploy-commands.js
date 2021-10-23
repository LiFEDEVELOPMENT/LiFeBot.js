const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
require('dotenv').config();

// Load environment data
const mode = process.env.MODE;
const clientId = process.env.CLIENTID;
const token = process.env.BOT_TOKEN;
const guildId = process.env.GUILDID;

// Prepare fetch of all command files
const commands = [];
const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	// Push all commands out of the seperate files into a single json-array
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Prepare Route to Discord
const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		// Check if the bot is in developer mode. If so, put commands into development guild, if not, put commands into global application commands
		if (mode == 'DEV') {
			console.log(`Started refreshing guild (/) commands for ${guildId}`);
			await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
				body: commands,
			});
			console.log(`Successfully reloaded guild (/) commands for ${guildId}`);
		} else {
			console.log('Started refreshing application (/) commands.');
			await rest.put(Routes.applicationCommands(clientId), { body: commands });
			console.log('Successfully reloaded application (/) commands.');
		}
	} catch (error) {
		console.error(error);
	}
})();
