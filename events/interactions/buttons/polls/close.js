const { MessageEmbed } = require('discord.js');
const sql = require('@sql');

module.exports = {
	async execute(interaction, id) {
		const pollData = await sql.query(`SELECT * FROM polls WHERE id=${id}`);
		const voteData = await sql.query(
			`SELECT * FROM pollvotes WHERE pollid=${id}`
		);
		let votes = {
			0: 0,
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			6: 0,
			7: 0,
			8: 0,
			9: 0,
		};
		let totalVotes = 0;

		// Check if the user has the permission to end the poll
		if (
			!interaction.member.permissions.has('MANAGE_MESSAGES') &&
			!(interaction.user.id == pollData[0].authorid)
		) {
			interaction.reply({
				content:
					'Du hast nicht die Berechtigung, diese Poll zu beenden! Du brauchst die Berechtigung "MANAGE_MESSAGES" oder musst der Author dieser Poll sein!',
				ephemeral: true,
			});
			return;
		}

		// Count/Store the votes for each option and total votes
		for (let vote of voteData) {
			votes[vote.vote]++;
			totalVotes++;
		}

		// Create a new MessageEmbed and put the poll's question in the title
		let embed = new MessageEmbed().setTitle(
			`Die Umfrageergebnisse - ${pollData[0].frage}:`
		);

		let pollAsArray = Object.values(pollData[0]);

		for (let i = 6; i < 16; i++) {
			let currentAnswer = pollAsArray[i];

			if (currentAnswer == '') break;

			embed.addField(currentAnswer, votes[i - 6].toString(), true);
		}

		// Footer
		let arr = Object.values(votes);
		let maxVotes = Math.max(...arr);
		let winningAnswers = '';

		if (max > 0)
			for (let i = 1; i <= arr.length; i++) {
				if (arr[i - 1] == maxVotes) winningAnswers += i + ', ';
			}
		else winningAnswers = 'Es wurde für keine Option abgestimmt.';
		winningAnswers = winningAnswers.substring(0, winningAnswers.length - 2);

		let footer =
			winningAnswers.length == 1
				? `Antwort ${winningAnswers} gewinnt!`
				: `Es gewinnen die folgenden Antworten: ${winningAnswers}!`;

		let pollCreator = await interaction.client.users
			.fetch(pollData[0].authorid)
			.catch(() => {
				return {
					username:
						'einem Discord Account, der leider nicht mehr unter uns ist lol',
				};
			});

		footer += ` - Die Umfrage wurde erstellt von ${pollCreator.username}#${pollCreator.discriminator}. Insgesamt gab es ${totalVotes} Stimmen!`;
		embed.setFooter({ text: footer });
		embed.setColor('AQUA');
		embed.setTimestamp();

		interaction.message.edit({
			embeds: [embed],
			components: [],
		});

		await sql.run('UPDATE polls SET open=? WHERE id=?', [false, id]);

		interaction.reply({ content: 'Diese Umfrage wurde beendet!' });
	},
};
