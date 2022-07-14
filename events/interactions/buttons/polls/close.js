import { MessageEmbed, Permissions, Util } from 'discord.js';
import sql from '#sql';
import lang from '#util/Lang';
import errorMessage from '#errormessage';

const execute = async (interaction, id) => {
	try {
		const locale = interaction.locale;
		const pollData = sql.query(`SELECT * FROM polls WHERE id=${id}`);
		const voteData = sql.query(`SELECT * FROM pollvotes WHERE pollid=${id}`);
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
			!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) &&
			!(interaction.user.id === pollData[0].authorid)
		)
			return interaction.reply({
				content: lang('POLL_EXECUTE_CLOSE_PROHIBITED', locale),
				ephemeral: true,
			});

		// Count/Store the votes for each option and total votes
		for (let vote of voteData) {
			votes[vote.vote]++;
			totalVotes++;
		}

		// Create a new MessageEmbed and put the poll's question in the title
		let embed = new MessageEmbed().setTitle(
			lang(
				'POLL_EXECUTE_RESULT_EMBED',
				{
					QUESTION: pollData[0].question,
				},
				locale
			)
		);

		let pollAsArray = Object.values(pollData[0]);

		for (let i = 6; i < 16; i++) {
			let currentAnswer = pollAsArray[i];

			if (currentAnswer === '') break;

			embed.addField(
				Util.escapeMarkdown(currentAnswer),
				votes[i - 6].toString(),
				true
			);
		}

		// Footer
		let arr = Object.values(votes);
		let maxVotes = Math.max(...arr);
		let winningAnswers = '';

		if (maxVotes > 0)
			for (let i = 1; i <= arr.length; i++) {
				if (arr[i - 1] === maxVotes) winningAnswers += i + ', ';
			}
		else winningAnswers = lang('POLL_EXECUTE_NO_VOTES', locale);
		winningAnswers = winningAnswers.endsWith(', ')
			? winningAnswers.substring(0, winningAnswers.length - 2)
			: winningAnswers;

		let footer =
			winningAnswers.length === 1
				? lang('POLL_EXECUTE_ONE_WINNER', { WINNING: winningAnswers }, locale)
				: lang(
						'POLL_EXEUCUTE_MULTIPLE_WINNERS',
						{
							WINNING: winningAnswers,
						},
						locale
				  );

		let pollCreator = await interaction.client.users
			.fetch(pollData[0].authorid)
			.catch(() => {
				return {
					tag: 'n/a',
				};
			});

		footer += lang(
			'POLL_EXECUTE_RESULT_EMBED_FOOTER',
			{
				CREATOR: pollCreator.tag,
				TOTALVOTES: totalVotes,
			},
			locale
		);
		embed.setFooter({ text: footer });
		embed.setColor('AQUA');
		embed.setTimestamp();

		interaction.message.edit({
			embeds: [embed],
			components: [],
		});

		interaction.reply({
			content: lang('POLL_EXECUTE_REPLY_ENDED', locale),
		});
	} catch (error) {
		errorMessage(interaction, error);
	}
};
export { execute };
