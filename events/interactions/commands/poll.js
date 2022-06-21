import { SlashCommandBuilder } from '@discordjs/builders';
import {
	MessageSelectMenu,
	MessageActionRow,
	MessageButton,
	Util,
} from 'discord.js';
import util from '#util/Utilities';
import lang from '#lang';
import errorMessage from '#errormessage';

async function create() {
	const choices = [];
	for (let i = 1; i <= 10; i++) {
		choices.push([`Only allow ${i} answer(s) per user`, i]);
	}

	const command = new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Starts a poll for all users in this channel to vote on')
		.addStringOption((option) =>
			option
				.setName('question')
				.setDescription('The question you want to ask')
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName('multiplechoicecount')
				.setDescription(
					'How many answers you want to allow simultaneously per user'
				)
				.addChoices(choices)
				.setRequired(true)
		);

	for (let i = 1; i <= 10; i++) {
		command.addStringOption((option) =>
			option
				.setName(`answer${i}`)
				.setDescription(`Answer no. ${i}`)
				.setRequired(i <= 2)
		);
	}

	return command.toJSON();
}

async function execute(interaction) {
	const locale = interaction.locale;
	try {
		const guildid = interaction.guild.id;
		const question = Util.escapeMarkdown(
			interaction.options.getString('question')
		);
		const maxChoices = interaction.options.getInteger('multiplechoicecount');
		let choices = [];

		// Push all user-set choices into array
		for (let i = 1; i <= 10; i++) {
			let currentChoice = interaction.options.getString(`answer${i}`);

			if (currentChoice === null) break;
			choices.push(currentChoice);
		}

		// Save old length and fill up the array with empty strings to be of size 10
		const realChoiceCount = choices.length;
		for (let i = choices.length; i < 10; i++) {
			choices.push('');
		}

		// Register a new poll
		let id = await util.registerNewPoll(
			guildid,
			interaction.user.id,
			maxChoices,
			question,
			...choices
		);

		// Prepare the SelectionMenu
		let selectMenu = new MessageSelectMenu()
			.setCustomId(`polls/vote-${id}`)
			.setMaxValues(maxChoices)
			.setPlaceholder(
				await lang(
					'POLL_EXECUTE_MENU_PLACEHOLDER',
					{
						CHOICECOUNT: maxChoices,
					},
					locale
				)
			);

		// Prepare the stop Button
		let closeButton = new MessageButton()
			.setCustomId(`polls/close-${id}`)
			.setLabel(await lang('POLL_EXECUTE_BUTTON_STOP', {}, locale))
			.setStyle('DANGER');

		// Fill the options into the SelectionMenu
		for (let j = 0; j < realChoiceCount; j++) {
			selectMenu.addOptions({ label: choices[j], value: j.toString() });
		}

		// Prepare two ActionRows for the SelectionMenu and the Button
		let menuRow = new MessageActionRow().addComponents(selectMenu);
		let buttonRow = new MessageActionRow().addComponents(closeButton);

		// Create the message with the poll
		interaction.reply({
			content: await lang(
				'POLL_EXECUTE_REPLY_TITLE',
				{ STRING: question },
				locale
			),
			components: [menuRow, buttonRow],
		});
	} catch (error) {
		errorMessage(interaction, error);
	}
}

export { create, execute };
