const sql = require('@sql');

module.exports = {
	async execute(interaction, id) {
		const userid = interaction.user.id;
		const votes = interaction.values;

		// Deletes all previous entries of this user for this poll
		await sql.run('DELETE FROM pollvotes WHERE pollid=? AND userid=?', [
			id,
			userid,
		]);

		// Saves the user's votes
		for (vote of votes) {
			await sql.run(
				'INSERT INTO pollvotes (pollid,userid,vote) VALUES (?,?,?)',
				[id, userid, parseInt(vote)]
			);
		}

		// Reply to the vote
		await interaction.reply({
			content:
				'Deine Stimme wurde gewertet! Du kannst deine Stimme aber bis zur Beendigung dieser Umfrage jederzeit ändern!',
			ephemeral: true,
		});
	},
};
