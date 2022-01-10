const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	MessageSelectMenu,
	MessageActionRow,
	MessageButton,
} = require('discord.js');
const sql = require('@sql');
const util = require('@util/Utilities.js');
const lang = require('@lang');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription(await lang.getString('POLL_COMMAND_DESCRIPTION'))
		.addStringOption((option) =>
			option
				.setName(await lang.getString('POLL_COMMAND_QUESTION'))
				.setDescription(await lang.getString('POLL_QUESTION_DESCRIPTION'))
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName('multiplechoicecount')
				.setDescription(await lang.getString('POLL_MULTIPLECHOICE_DESCRIPTION'))
				.addChoices([
					[await lang.getString('POLL_MULTIPLECHOICE_ONE'), 1],
					[
						await lang.getString('POLL_MULTIPLECHOICE_MULTIPLE', { COUNT: 2 }),
						2,
					],
					[
						await lang.getString('POLL_MULTIPLECHOICE_MULTIPLE', { COUNT: 3 }),
						3,
					],
					[
						await lang.getString('POLL_MULTIPLECHOICE_MULTIPLE', { COUNT: 4 }),
						4,
					],
					[
						await lang.getString('POLL_MULTIPLECHOICE_MULTIPLE', { COUNT: 5 }),
						5,
					],
					[
						await lang.getString('POLL_MULTIPLECHOICE_MULTIPLE', { COUNT: 6 }),
						6,
					],
					[
						await lang.getString('POLL_MULTIPLECHOICE_MULTIPLE', { COUNT: 7 }),
						7,
					],
					[
						await lang.getString('POLL_MULTIPLECHOICE_MULTIPLE', { COUNT: 8 }),
						8,
					],
					[
						await lang.getString('POLL_MULTIPLECHOICE_MULTIPLE', { COUNT: 9 }),
						9,
					],
					[
						await lang.getString('POLL_MULTIPLECHOICE_MULTIPLE', { COUNT: 10 }),
						10,
					],
				])
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName(await lang.getString('POLL_CHOICE_NAME', { NUMBER: 1 }))
				.setDescription(await lang.getString('POLL_MULTIPLECHOICE_FIRST'))
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName(await lang.getString('POLL_CHOICE_NAME', { NUMBER: 2 }))
				.setDescription(
					await lang.getString('POLL_MULTIPLECHOICE_NTH', { NUMBER: 2 })
				)
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName(await lang.getString('POLL_CHOICE_NAME', { NUMBER: 3 }))
				.setDescription(
					await lang.getString('POLL_MULTIPLECHOICE_NTH', { NUMBER: 3 })
				)
		)
		.addStringOption((option) =>
			option
				.setName(await lang.getString('POLL_CHOICE_NAME', { NUMBER: 4 }))
				.setDescription(
					await lang.getString('POLL_MULTIPLECHOICE_NTH', { NUMBER: 4 })
				)
		)
		.addStringOption((option) =>
			option
				.setName(await lang.getString('POLL_CHOICE_NAME', { NUMBER: 5 }))
				.setDescription(
					await lang.getString('POLL_MULTIPLECHOICE_NTH', { NUMBER: 5 })
				)
		)
		.addStringOption((option) =>
			option
				.setName(await lang.getString('POLL_CHOICE_NAME', { NUMBER: 6 }))
				.setDescription(
					await lang.getString('POLL_MULTIPLECHOICE_NTH', { NUMBER: 6 })
				)
		)
		.addStringOption((option) =>
			option
				.setName(await lang.getString('POLL_CHOICE_NAME', { NUMBER: 7 }))
				.setDescription(
					await lang.getString('POLL_MULTIPLECHOICE_NTH', { NUMBER: 7 })
				)
		)
		.addStringOption((option) =>
			option
				.setName(await lang.getString('POLL_CHOICE_NAME', { NUMBER: 8 }))
				.setDescription(
					await lang.getString('POLL_MULTIPLECHOICE_NTH', { NUMBER: 8 })
				)
		)
		.addStringOption((option) =>
			option
				.setName(await lang.getString('POLL_CHOICE_NAME', { NUMBER: 9 }))
				.setDescription(
					await lang.getString('POLL_MULTIPLECHOICE_NTH', { NUMBER: 9 })
				)
		)
		.addStringOption((option) =>
			option
				.setName(await lang.getString('POLL_CHOICE_NAME', { NUMBER: 10 }))
				.setDescription(
					await lang.getString('POLL_MULTIPLECHOICE_NTH', { NUMBER: 10 })
				)
		),
	async execute(interaction) {
		const guildid = interaction.guild.id;
		const frage = interaction.options.getString(
			await lang.getString('POLL_COMMAND_QUESTION')
		);
		const maxAntworten = interaction.options.getInteger('multiplechoicecount');
		let choices = [];

		// Push all user-set choices into array
		for (let i = 1; i <= 10; i++) {
			let current =
				(await lang.getString('POLL_CHOICE_NAME_NOREPLACE')) + i.toString();
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
				await lang.getString(
					'POLL_MENU_PLACEHOLDER',
					{
						CHOICECOUNT: realChoiceCount,
					},
					guildid
				)
			);

		// Prepare the stop Button
		let closeButton = new MessageButton()
			.setCustomId(`polls-close-${id}`)
			.setLabel(await lang.getString('POLL_STOP', {}, guildid))
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
			content: await lang.getString(
				'POLL_REPLY_TITLE',
				{ STRING: frage },
				guildid
			),
			components: [menuRow, buttonRow],
		});
	},
};
