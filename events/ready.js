import lang from '#lang';

async function execute(client) {
	console.log(
		await lang('LOGIN_CONFIRMATION', '', {
			USERTAG: client.user.tag,
		})
	);
}

const once = true;
const name = 'ready';

export default { name, once, execute };
