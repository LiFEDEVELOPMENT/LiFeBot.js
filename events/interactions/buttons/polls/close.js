import { EmbedBuilder, escapeMarkdown, PermissionFlagsBits } from 'discord.js';
import sql from '#sql';
import lang from '#util/Lang';
import errorMessage from '#errormessage';

const execute = async (interaction, id) => {
	try {
		const locale = interaction.locale;
		const pollData = sql.query(`SELECT * FROM polls WHERE id=${id}`);
		const voteData = sql.query(`SELECT * FROM pollvotes WHERE pollid=${id}`);
		const pollParticipants = sql.query(
			`SELECT COUNT(*) AS votes FROM (SELECT userid FROM pollvotes WHERE pollid=${id} GROUP BY userid)`
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
			!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages) &&
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

		// Create a new EmbedBuilder and put the poll's question in the title
		let embed = new EmbedBuilder().setTitle(
			lang('POLL_EXECUTE_RESULT_EMBED', locale, {
				QUESTION: pollData[0].question,
			})
		);

		let pollAsArray = Object.values(pollData[0]);

		let embedFields = [];

		for (let i = 6; i < 16; i++) {
			let currentAnswer = pollAsArray[i];

			if (currentAnswer === '') break;

			embedFields.push({
				name: escapeMarkdown(currentAnswer),
				value: votes[i - 6].toString(),
				inline: true,
			});
		}

		embed.addFields(embedFields);

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
				? lang('POLL_EXECUTE_ONE_WINNER', locale, { WINNING: winningAnswers })
				: lang('POLL_EXEUCUTE_MULTIPLE_WINNERS', locale, {
						WINNING: winningAnswers,
				  });

		let pollCreator = await interaction.client.users
			.fetch(pollData[0].authorid)
			.catch(() => {
				return {
					tag: 'n/a',
				};
			});

		footer += lang('POLL_EXECUTE_RESULT_EMBED_FOOTER', locale, {
			CREATOR: pollCreator.tag,
			TOTALVOTES: totalVotes,
			TOTALVOTERS: pollParticipants[0].votes,
		});
		embed.setFooter({ text: footer });
		embed.setColor('Aqua');
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
