import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	escapeMarkdown,
	SelectMenuBuilder,
	SlashCommandBuilder,
} from 'discord.js';
import util from '#util/Utilities';
import lang from '#util/Lang';

import errorMessage from '#errormessage';

const create = () => {
	const choices = [];
	for (let i = 1; i <= 10; i++) {
		choices.push({ name: `Only allow ${i} answer(s) per user`, value: i });
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
				.setDescription('The amount of multiple choices you want to allow')
				.setChoices(...choices)
				.setRequired(true)
		)
		.setDMPermission(false);

	for (let i = 1; i <= 10; i++) {
		command.addStringOption((option) =>
			option
				.setName(`answer${i}`)
				.setDescription(`Answer no. ${i}`)
				.setRequired(i <= 2)
		);
	}

	return command.toJSON();
};

const execute = (interaction) => {
	try {
		const locale = interaction.locale;
		const guildid = interaction.guild.id;
		const question = escapeMarkdown(interaction.options.getString('question'));
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
		let id = util.registerNewPoll(
			guildid,
			interaction.user.id,
			maxChoices,
			question,
			...choices
		);

		// Prepare the SelectionMenu
		let selectMenu = new SelectMenuBuilder()
			.setCustomId(`polls/vote-${id}`)
			.setMaxValues(maxChoices)
			.setPlaceholder(
				lang('POLL_EXECUTE_MENU_PLACEHOLDER', locale, {
					CHOICECOUNT: maxChoices,
				})
			);

		// Prepare the stop Button
		let closeButton = new ButtonBuilder()
			.setCustomId(`polls/close-${id}`)
			.setLabel(lang('POLL_EXECUTE_BUTTON_STOP', locale))
			.setStyle(ButtonStyle.Danger);

		// Fill the options into the SelectionMenu
		for (let j = 0; j < realChoiceCount; j++) {
			selectMenu.addOptions({ label: choices[j], value: j.toString() });
		}

		// Prepare two ActionRowBuilders for the SelectionMenu and the Button
		let menuRow = new ActionRowBuilder().addComponents(selectMenu);
		let buttonRow = new ActionRowBuilder().addComponents(closeButton);

		// Create the message with the poll
		interaction.reply({
			content: lang('POLL_EXECUTE_REPLY_TITLE', locale, { STRING: question }),
			components: [menuRow, buttonRow],
		});
	} catch (error) {
		errorMessage(interaction, error);
	}
};

export { create, execute };
