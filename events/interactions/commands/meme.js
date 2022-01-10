const {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const memeUtil = require('@util/MemeUtil.js');
const lang = require('@lang');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription(await lang.getString('MEME_SUBCOMMAND_DESCRIPTION'))
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('random')
				.setDescription(await lang.getString('MEME_COMMAND_RANDOM_DESCRIPTION'))
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('add')
				.setDescription(await lang.getString('MEME_COMMAND_ADD_DESCRIPTION'))
		)
		.addStringOption((option) =>
			option
				.setName('meme')
				.setDescription(
					await lang.getString('MEME_COMMAND_ADD_MEME_DESCRIPTION')
				)
				.setRequired(true)
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('delete')
				.setDescription(await lang.getString('MEME_COMMAND_DELETE_DESCRIPTION'))
				.addIntegerOption((option) =>
					option
						.setName('id')
						.setDescription(
							await lang.getString('MEME_COMMAND_DELETE_ID_DESCRIPTION')
						)
						.setRequired(true)
				)
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('list')
				.setDescription(await lang.getString('MEME_COMMAND_LIST_DESCRIPTION'))
		),
	async execute(interaction) {
		const guildid = interaction.member.guild.id;
		let actionRow;
		let memeEmbed;
		let answer = {
			content: await lang.getString('MEME_COMMAND_ERROR', {}, guildid),
			ephemeral: true,
		};

		switch (interaction.options.getSubcommand()) {
			case 'add':
				const meme = interaction.options.getString('meme');

				const memeID = await memeUtil.addMeme(guildid, meme);
				answer = await lang.getString(
					'MEME_COMMAND_ADD_ANSWER',
					{ MEMEID: memeID },
					guildid
				);

				break;
			case 'delete':
				const toDeleteID = interaction.options.getInteger('id');
				answer = await lang.getString(
					'MEME_COMMAND_DELETE_ANSWER_SUCCESS',
					{ MEMEID: toDeleteID },
					guildid
				);

				if ((await memeUtil.deleteMeme(toDeleteID, guildid)) == false)
					answer = {
						content: await lang.getString(
							'MEME_COMMAND_DELETE_ANSWER_FAIL',
							{ MEMEID: toDeleteID },
							guildid
						),
						ephemeral: true,
					};

				break;
			case 'list':
				let memeList = await memeUtil.charLimitList(guildid);

				if (memeList[0] == undefined) {
					answer = {
						content: await lang.getString('MEME_LIST_NO_MEMES', {}, guildid),
						ephemeral: true,
					};
					break;
				}

				memeEmbed = new MessageEmbed()
					.setTitle(
						await lang.getString(
							'MEME_LIST_TITLE',
							{ GUILDNAME: interaction.guild.name },
							guildid
						)
					)
					.setDescription(memeList[0])
					.setTimestamp();

				const nextButtonsDisabled = !(memeList.length > 1);

				actionRow = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId('memes-firstPage')
						.setStyle('PRIMARY')
						.setLabel(await lang.getString('FIRST_PAGE', {}, guildid))
						.setDisabled(true),
					new MessageButton()
						.setCustomId('memes-previousPage')
						.setStyle('PRIMARY')
						.setLabel(await lang.getString('PREVIOUS_PAGE', {}, guildid))
						.setDisabled(true),
					new MessageButton()
						.setCustomId('memes-nextPage')
						.setStyle('PRIMARY')
						.setLabel(await lang.getString('NEXT_PAGE', {}, guildid))
						.setDisabled(nextButtonsDisabled),
					new MessageButton()
						.setCustomId('memes-lastPage')
						.setStyle('PRIMARY')
						.setLabel(await lang.getString('LAST_PAGE', {}, guildid))
						.setDisabled(nextButtonsDisabled)
				);

				answer = { embeds: [memeEmbed], components: [actionRow] };

				break;
			case 'random':
				let randomMeme = await memeUtil.randomMeme(interaction.guild.id);

				memeEmbed = new MessageEmbed()
					.setTitle(await lang.getString('MEME_RANDOM', {}, guildid))
					.setDescription(randomMeme.meme)
					.setFooter({
						text: await lang.getString(
							'MEME_RANDOM_FOOTER',
							{ MEMEID: randomMeme.id },
							guildid
						),
					})
					.setColor('ORANGE');

				actionRow = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId('memes-newRandom')
						.setStyle('PRIMARY')
						.setLabel(await lang.getString('ANOTHER_MEME', {}, guildid))
				);
				answer = { embeds: [memeEmbed], components: [actionRow] };
		}

		if (!interaction.deferred) await interaction.reply(answer);
		else await interaction.editReply(answer);
	},
};
