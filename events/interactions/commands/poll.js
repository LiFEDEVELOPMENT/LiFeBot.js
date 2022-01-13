import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageSelectMenu, MessageActionRow, MessageButton } from 'discord.js';
import util from '#util/Utilities.js';
import lang from '#lang';

async function create() {
	const choices = [];
	choices.push([await lang('POLL_COMMAND_MULTIPLECHOICE_CHOICE_ONE'), 1]);
	for (let i = 2; i <= 10; i++) {
		choices.push([
			await lang('POLL_COMMAND_MULTIPLECHOICE_CHOICE_MULTIPLE', { COUNT: i }),
			i,
		]);
	}

	const command = new SlashCommandBuilder()
		.setName('poll')
		.setDescription(await lang('POLL_COMMAND_DESCRIPTION'))
		.addStringOption((option) =>
			option
				.setName(await lang('POLL_COMMAND_QUESTION_NAME'))
				.setDescription(await lang('POLL_COMMAND_QUESTION_DESCRIPTION'))
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName('multiplechoicecount')
				.setDescription(await lang('POLL_COMMAND_MULTIPLECHOICE_DESCRIPTION'))
				.addChoices(choices)
				.setRequired(true)
		);

	command.addStringOption((option) =>
		option
			.setName(await lang('POLL_COMMAND_CHOICE_NAME', { NUMBER: 1 }))
			.setDescription(await lang('POLL_COMMAND_MULTIPLECHOICE_FIRST'))
			.setRequired(true)
	);

	for (let i = 2; i <= 10; i++) {
		command.addStringOption((option) =>
			option
				.setName(await lang('POLL_COMMAND_CHOICE_NAME', { NUMBER: i }))
				.setDescription(
					await lang('POLL_COMMAND_MULTIPLECHOICE_NTH', { NUMBER: i })
				)
				.setRequired(i == 2)
		);
	}
}

async function execute(interaction) {
	try {
		const guildid = interaction.guild.id;
		const question = interaction.options.getString(
			await lang('POLL_COMMAND_QUESTION_NAME')
		);
		const maxAntworten = interaction.options.getInteger('multiplechoicecount');
		let choices = [];

		// Push all user-set choices into array
		for (let i = 1; i <= 10; i++) {
			let currentChoice = interaction.options.getString(
				await lang('POLL_COMMAND_CHOICE_NAME', { COUNT: i })
			);

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
			question,
			...choices
		);

		// Prepare the SelectionMenu
		let selectMenu = new MessageSelectMenu()
			.setCustomId(`polls-vote-${id}`)
			.setMaxValues(maxAntworten)
			.setPlaceholder(
				await lang(
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
			.setLabel(await lang('POLL_STOP', {}, guildid))
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
				guildid
			),
			components: [menuRow, buttonRow],
		});
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR'),
			ephemeral: true,
		});
	}
}

export default { create, execute };
