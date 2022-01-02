module.exports = {
	async fetchAllMessages(
		channel,
		options = {
			reverseArray: true,
			userOnly: false,
			botOnly: false,
			pinnedOnly: false,
		}
	) {
		//https://github.com/iColtz/discord-fetch-all
		const { reverseArray, userOnly, botOnly, pinnedOnly } = options;
		let messages = [];
		let lastID;
		while (true) {
			const fetchedMessages = await channel.messages.fetch({
				limit: 100,
				...(lastID && { before: lastID }),
			});
			if (fetchedMessages.size === 0) {
				if (reverseArray) {
					messages = messages.reverse();
				}
				if (userOnly) {
					messages = messages.filter((msg) => !msg.author.bot);
				}
				if (botOnly) {
					messages = messages.filter((msg) => msg.author.bot);
				}
				if (pinnedOnly) {
					messages = messages.filter((msg) => msg.pinned);
				}
				return messages;
			}
			messages = messages.concat(Array.from(fetchedMessages.values()));
			lastID = fetchedMessages.lastKey();
		}
	},
};
