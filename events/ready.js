import fs from 'fs';

async function execute(client) {
	const commands = fs
		.readdirSync('./events/interactions/commands')
		.filter((file) => file.endsWith('.js'))
		.map((file) => file.slice(0, -3));

	const commandsArray = [];

	for (let command of commands) {
		const commandFile = await import(`#commands/${command}`);
		commandsArray.push(await commandFile.create());
	}

	if (process.env.MODE === 'DEV')
		client.application.commands.set(commandsArray, process.env.GUILDID);
	else client.application.commands.set(commandsArray);

	console.log(`Ready! Logged in as ${client.user.tag}`);
}

const once = true;
const name = 'ready';

export { name, once, execute };
