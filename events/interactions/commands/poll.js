const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	MessageSelectMenu,
	MessageActionRow,
	MessageButton,
} = require('discord.js');
const sql = require('@sql');
const util = require('@util/Utilities.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription(
			'Startet eine Umfrage mit bis zu zehn Antwortmöglichkeiten!'
		)
		.addStringOption((option) =>
			option
				.setName('frage')
				.setDescription('Die Frage, die du stellen möchtest')
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName('multiplechoisecount')
				.setDescription(
					'Wie viele Antwortmöglichkeiten dürfen maximal gleichzeitig ausgewählt sein?'
				)
				.addChoices([
					['Maximal 1 Antwort gleichzeitig auswählbar', 1],
					['Maximal 2 Antworten gleichzeitig auswählbar', 2],
					['Maximal 3 Antworten gleichzeitig auswählbar', 3],
					['Maximal 4 Antworten gleichzeitig auswählbar', 4],
					['Maximal 5 Antworten gleichzeitig auswählbar', 5],
					['Maximal 6 Antworten gleichzeitig auswählbar', 6],
					['Maximal 7 Antworten gleichzeitig auswählbar', 7],
					['Maximal 8 Antworten gleichzeitig auswählbar', 8],
					['Maximal 9 Antworten gleichzeitig auswählbar', 9],
					['Maximal 10 Antworten gleichzeitig auswählbar', 10],
				])
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('antwort1')
				.setDescription('Die 1. Antwortmöglichkeit')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('antwort2')
				.setDescription('Die 2. Antwortmöglichkeit')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option.setName('antwort3').setDescription('Die 3. Antwortmöglichkeit')
		)
		.addStringOption((option) =>
			option.setName('antwort4').setDescription('Die 4. Antwortmöglichkeit')
		)
		.addStringOption((option) =>
			option.setName('antwort5').setDescription('Die 5. Antwortmöglichkeit')
		)
		.addStringOption((option) =>
			option.setName('antwort6').setDescription('Die 6. Antwortmöglichkeit')
		)
		.addStringOption((option) =>
			option.setName('antwort7').setDescription('Die 7. Antwortmöglichkeit')
		)
		.addStringOption((option) =>
			option.setName('antwort8').setDescription('Die 8. Antwortmöglichkeit')
		)
		.addStringOption((option) =>
			option.setName('antwort9').setDescription('Die 9. Antwortmöglichkeit')
		)
		.addStringOption((option) =>
			option.setName('antwort10').setDescription('Die 10. Antwortmöglichkeit')
		),
	async execute(interaction) {
		const frage = interaction.options.getString('frage');
		const maxAntworten = interaction.options.getInteger('multiplechoisecount');
		let choices = [];

		// Push all user-set choices into array
		for (let i = 1; i <= 10; i++) {
			let current = 'antwort' + i.toString();
			let currentChoice = interaction.options.getString(current);

			if (currentChoice == null) break;
			choices.push(currentChoice);
		}

		// Save old length and fill up the array with empty strings
		const realChoiceCount = choices.length;
		for (let i = choices.length; i < 10; i++) {
			choices.push('');
		}

		// Register a new poll
		let id = await util.registerNewPoll(
			interaction.guild.id,
			interaction.user.id,
			maxAntworten,
			frage,
			...choices
		);

		// Prepare the SelectionMenu
		let selectMenu = new MessageSelectMenu()
			.setCustomId(`polls-vote-${id}`)
			.setMaxValues(maxAntworten)
			.setPlaceholder(
				`Du kannst maximal ${realChoiceCount} Antworten auswählen und diese bis zum Ende dieser Umfrage jederzeit ändern!`
			);

		// Prepare the stop Button
		let closeButton = new MessageButton()
			.setCustomId(`polls-close-${id}`)
			.setLabel('Umfrage beenden!')
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
			content: `Frage: ${frage}`,
			components: [menuRow, buttonRow],
		});
	},
};
