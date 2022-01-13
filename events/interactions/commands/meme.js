import {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from '@discordjs/builders';
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import util from '#util/MemeUtil';
import lang from '#lang';

async function create() {
	const command = new SlashCommandBuilder()
		.setName('meme')
		.setDescription(await lang('MEME_COMMAND_DESCRIPTION'));

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('random')
			.setDescription(await lang('MEME_COMMAND_RANDOM_DESCRIPTION'))
	);

	command
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('add')
				.setDescription(await lang('MEME_COMMAND_ADD_DESCRIPTION'))
		)
		.addStringOption((option) =>
			option
				.setName('meme')
				.setDescription(await lang('MEME_COMMAND_ADD_MEME_DESCRIPTION'))
				.setRequired(true)
		);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('delete')
			.setDescription(await lang('MEME_COMMAND_DELETE_DESCRIPTION'))
			.addIntegerOption((option) =>
				option
					.setName('id')
					.setDescription(await lang('MEME_COMMAND_DELETE_ID_DESCRIPTION'))
					.setRequired(true)
			)
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('list')
			.setDescription(await lang('MEME_COMMAND_LIST_DESCRIPTION'))
	);

	return command.toJSON();
}
async function execute(interaction) {
	try {
		const guildid = interaction.guild.id;
		let answer = {
			content: await lang('MEME_COMMAND_ERROR', {}, guildid),
			ephemeral: true,
		};

		switch (interaction.options.getSubcommand()) {
			case 'add':
				answer = await addCommand(interaction, guildid);
				break;
			case 'delete':
				answer = await deleteCommand(interaction, guildid);
				break;
			case 'list':
				answer = await listCommand(interaction, guildid);
				break;
			case 'random':
				answer = await randomCommand(interaction, guildid);
		}

		if (!interaction.deferred) await interaction.reply(answer);
		else await interaction.editReply(answer);
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR'),
			ephemeral: true,
		});
	}
}

async function addCommand(interaction, guildid) {
	try {
		const meme = interaction.options.getString('meme');

		const memeID = await util.addMeme(guildid, meme);
		return await lang('MEME_EXECUTE_ADD_SUCCESS', { MEMEID: memeID }, guildid);
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR'),
			ephemeral: true,
		});
	}
}

async function deleteCommand(interaction, guildid) {
	try {
		const toDeleteID = interaction.options.getInteger('id');

		if ((await util.deleteMeme(toDeleteID, guildid)) == false)
			return {
				content: await lang(
					'MEME_COMMAND_DELETE_ANSWER_FAIL',
					{ MEMEID: toDeleteID },
					guildid
				),
				ephemeral: true,
			};

		return await lang(
			'MEME_COMMAND_DELETE_ANSWER_SUCCESS',
			{ MEMEID: toDeleteID },
			guildid
		);
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR'),
			ephemeral: true,
		});
	}
}

async function listCommand(interaction, guildid) {
	try {
		const memeList = await util.charLimitList(guildid);

		if (memeList[0] == undefined)
			return {
				content: await lang('MEME_EXECUTE_LIST_EMBED_NO_MEMES', {}, guildid),
				ephemeral: true,
			};

		const memeEmbed = new MessageEmbed()
			.setTitle(
				await lang(
					'MEME_EXECUTE_LIST_EMBED_TITLE',
					{ GUILDNAME: interaction.guild.name },
					guildid
				)
			)
			.setDescription(memeList[0])
			.setTimestamp();

		const nextButtonsDisabled = !(memeList.length > 1);

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('memes-firstPage')
				.setStyle('PRIMARY')
				.setLabel(await lang('FIRST_PAGE', {}, guildid))
				.setDisabled(true),
			new MessageButton()
				.setCustomId('memes-previousPage')
				.setStyle('PRIMARY')
				.setLabel(await lang('PREVIOUS_PAGE', {}, guildid))
				.setDisabled(true),
			new MessageButton()
				.setCustomId('memes-nextPage')
				.setStyle('PRIMARY')
				.setLabel(await lang('NEXT_PAGE', {}, guildid))
				.setDisabled(nextButtonsDisabled),
			new MessageButton()
				.setCustomId('memes-lastPage')
				.setStyle('PRIMARY')
				.setLabel(await lang('LAST_PAGE', {}, guildid))
				.setDisabled(nextButtonsDisabled)
		);

		return { embeds: [memeEmbed], components: [actionRow] };
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR'),
			ephemeral: true,
		});
	}
}

async function randomCommand(interaction, guildid) {
	try {
		const randomMeme = await util.randomMeme(guildid);

		const memeEmbed = new MessageEmbed()
			.setTitle(await lang('MEME_EXECUTE_RANDOM_EMBED_TITLE', {}, guildid))
			.setDescription(randomMeme.meme)
			.setFooter({
				text: await lang(
					'MEME_EXECUTE_RANDOM_EMBED_FOOTER',
					{ MEMEID: randomMeme.id },
					guildid
				),
			})
			.setColor('ORANGE');

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('memes-newRandom')
				.setStyle('PRIMARY')
				.setLabel(await lang('MEME_EXECUTE_RANDOM_ANOTHER_MEME', {}, guildid))
		);
		answer = { embeds: [memeEmbed], components: [actionRow] };
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR'),
			ephemeral: true,
		});
	}
}

export default { create, execute };
