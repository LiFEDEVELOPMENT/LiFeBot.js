import {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from '@discordjs/builders';
import {
	MessageEmbed,
	MessageActionRow,
	MessageButton,
	Util,
} from 'discord.js';
import memeUtil from '#util/MemeUtil';
import lang from '#lang';

async function create() {
	const command = new SlashCommandBuilder()
		.setName('meme')
		.setDescription(
			'Meme command group. Contains subcommands for adding, deleting and displaying memes'
		);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('random')
			.setDescription('Displays a random meme from your server')
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('add')
			.setDescription("Adds a meme to the bot's meme database")
			.addStringOption((option) =>
				option
					.setName('meme')
					.setDescription('The meme you want to add')
					.setRequired(true)
			)
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('delete')
			.setDescription("Deletes a meme from the bot's database")
			.addIntegerOption((option) =>
				option
					.setName('id')
					.setDescription('The ID of the meme you want to delete')
					.setRequired(true)
			)
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('list')
			.setDescription('Lists all the memes from your server')
	);

	return command.toJSON();
}
async function execute(interaction) {
	const locale = interaction.locale;
	try {
		const guildid = interaction.guild.id;
		let answer = {
			content: await lang('ERROR', {}, locale),
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
			content: await lang('ERROR', {}, locale),
			ephemeral: true,
		});
	}
}

async function addCommand(interaction) {
	const locale = interaction.locale;
	try {
		const guildid = interaction.guild.id;
		const meme = Util.escapeMarkdown(interaction.options.getString('meme'));

		const memeID = await memeUtil.addMeme(guildid, meme);
		return await lang('MEME_EXECUTE_ADD_SUCCESS', { MEMEID: memeID }, locale);
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR', {}, locale),
			ephemeral: true,
		});
	}
}

async function deleteCommand(interaction) {
	const locale = interaction.locale;
	try {
		const guildid = interaction.guild.id;
		const toDeleteID = interaction.options.getInteger('id');

		if ((await memeUtil.deleteMeme(toDeleteID, guildid)) == false)
			return {
				content: await lang(
					'MEME_EXECUTE_DELETE_ERROR',
					{ MEMEID: toDeleteID },
					locale
				),
				ephemeral: true,
			};

		return await lang(
			'MEME_EXECUTE_DELETE_SUCCESS',
			{ MEMEID: toDeleteID },
			locale
		);
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR', {}, locale),
			ephemeral: true,
		});
	}
}

async function listCommand(interaction) {
	const locale = interaction.locale;
	try {
		const guildid = interaction.guild.id;
		const memeList = await memeUtil.charLimitList(guildid);

		if (memeList[0] === undefined)
			return {
				content: await lang('MEME_EXECUTE_LIST_REPLY_NO_MEMES', {}, locale),
				ephemeral: true,
			};

		const memeEmbed = new MessageEmbed()
			.setTitle(
				Util.escapeMarkdown(
					await lang(
						'MEME_EXECUTE_LIST_EMBED_TITLE',
						{ GUILDNAME: interaction.guild.name },
						locale
					)
				)
			)
			.setDescription(memeList[0])
			.setTimestamp();

		const nextButtonsDisabled = !(memeList.length > 1);

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('memes/firstPage')
				.setStyle('PRIMARY')
				.setLabel(await lang('FIRST_PAGE', {}, locale))
				.setDisabled(true),
			new MessageButton()
				.setCustomId('memes/previousPage')
				.setStyle('PRIMARY')
				.setLabel(await lang('PREVIOUS_PAGE', {}, locale))
				.setDisabled(true),
			new MessageButton()
				.setCustomId('memes/nextPage')
				.setStyle('PRIMARY')
				.setLabel(await lang('NEXT_PAGE', {}, locale))
				.setDisabled(nextButtonsDisabled),
			new MessageButton()
				.setCustomId('memes/lastPage')
				.setStyle('PRIMARY')
				.setLabel(await lang('LAST_PAGE', {}, locale))
				.setDisabled(nextButtonsDisabled)
		);

		return { embeds: [memeEmbed], components: [actionRow] };
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR', {}, locale),
			ephemeral: true,
		});
	}
}

async function randomCommand(interaction) {
	const locale = interaction.locale;
	try {
		const guildid = interaction.guild.id;
		const randomMeme = await memeUtil.randomMeme(guildid);

		const memeEmbed = new MessageEmbed()
			.setTitle(await lang('MEME_EXECUTE_RANDOM_EMBED_TITLE', {}, locale))
			.setDescription(randomMeme.meme.toString())
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
				.setCustomId('memes/newRandom')
				.setStyle('PRIMARY')
				.setLabel(await lang('MEME_EXECUTE_RANDOM_ANOTHER_MEME', {}, locale))
		);
		return { embeds: [memeEmbed], components: [actionRow] };
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR', {}, locale),
			ephemeral: true,
		});
	}
}

export { create, execute };
