import { MessageEmbed } from 'discord.js';
import sql from '#sql';
import lang from '#lang';

async function execute(interaction, id) {
	const guildid = interaction.guild.id;
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
			content: await lang('POLL_CLOSE_PROHIBITED', {}, guildid),
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
		await lang(
			'EMBED_TITLE_POLL_RESULT',
			{
				QUESTION: pollData[0].frage,
			},
			guildid
		)
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

	if (maxVotes > 0)
		for (let i = 1; i <= arr.length; i++) {
			if (arr[i - 1] == maxVotes) winningAnswers += i + ', ';
		}
	else winningAnswers = await lang('POLL_NO_VOTES', {}, guildid);
	winningAnswers = winningAnswers.substring(0, winningAnswers.length - 2);

	let footer =
		winningAnswers.length == 1
			? await lang('POLL_ONE_WINNER', { WINNING: winningAnswers }, guildid)
			: await lang(
					'POLL_MULTIPLE_WINNERS',
					{
						WINNING: winningAnswers,
					},
					guildid
			  );

	let pollCreator = await interaction.client.users
		.fetch(pollData[0].authorid)
		.catch(() => {
			return {
				username: await lang('DISCORD_LOST_ACCOUNT', {}, guildid),
			};
		});

	footer += await lang(
		'POLL_FOOTER',
		{
			CREATOR: pollCreator.username,
			DRISCRIMINATOR: pollCreator.discriminator,
			TOTALVOTES: totalVotes,
		},
		guildid
	);
	embed.setFooter({ text: footer });
	embed.setColor('AQUA');
	embed.setTimestamp();

	interaction.message.edit({
		embeds: [embed],
		components: [],
	});

	await sql.run('UPDATE polls SET open=? WHERE id=?', [false, id]);

	interaction.reply({
		content: await lang('POLL_ENDED', {}, guildid),
	});
}
export default { execute };
