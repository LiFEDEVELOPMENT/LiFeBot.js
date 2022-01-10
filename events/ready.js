const lang = require('@lang');
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(
			await lang.getString('LOGIN_CONFIRMATION', '', {
				USERTAG: client.user.tag,
			})
		);
	},
};
