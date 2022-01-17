import lang from '#lang';

async function execute(client) {
	console.log(await lang(`Ready! Logged in as ${client.user.tag}`));
}

const once = true;
const name = 'ready';

export { name, once, execute };
