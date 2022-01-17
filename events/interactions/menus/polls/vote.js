import sql from '#sql';
import lang from '#lang';

async function execute(interaction, id) {
	const userid = interaction.user.id;
	const votes = interaction.values;

	// Deletes all previous entries of this user for this poll
	await sql.run('DELETE FROM pollvotes WHERE pollid=? AND userid=?', [
		id,
		userid,
	]);

	// Saves the user's votes
	for (let vote of votes) {
		await sql.run('INSERT INTO pollvotes (pollid,userid,vote) VALUES (?,?,?)', [
			id,
			userid,
			parseInt(vote),
		]);
	}

	// Reply to the vote
	await interaction.reply({
		content: await lang('POLL_EXECUTE_VOTE_ACCEPTED', {}, interaction.locale),
		ephemeral: true,
	});
}

export { execute };
