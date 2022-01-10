const {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const zitatUtil = require('@util/ZitatUtil.js');
const utilities = require('@util/Utilities.js');
const lang = require('@lang');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('zitat')
		.setDescription(await lang.getString('QUOTE_SUBCOMMAND_DESCRIPTION'))
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('random')
				.setDescription(await lang.getString('QUOTE_COMMAND_MEME_DESCRIPTION'))
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('add')
				.setDescription(await lang.getString('QUOTE_COMMAND_ADD_DESCRIPTION'))
				.addStringOption((option) =>
					option
						.setName('zitat')
						.setDescription(
							await lang.getString('QUOTE_COMMAND_ADD_QUOTE_DESCRIPTION')
						)
						.setRequired(true)
				)
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('delete')
				.setDescription(
					await lang.getString('QUOTE_COMMAND_DELETE_DESCRIPTION')
				)
				.addIntegerOption((option) =>
					option
						.setName('id')
						.setDescription(
							await lang.getString('QUOTE_COMMAND_DELETE_ID_DESCRIPTION')
						)
						.setRequired(true)
				)
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('list')
				.setDescription(await lang.getString('QUOTE_COMMAND_LIST_DESCRIPTION'))
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('import')
				.setDescription(
					await lang.getString('QUOTE_COMMAND_IMPORT_DESCRIPTION')
				)
				.addStringOption((option) =>
					option
						.setName('channelid')
						.setDescription(
							await lang.getString('QUOTE_COMMAND_IMPORT_ID_DESCRIPTION')
						)
						.setRequired(true)
				)
		),
	async execute(interaction) {
		const guildid = interaction.member.guild.id;
		let actionRow;
		let zitateEmbed;
		let answer = {
			content: await lang.get('QUOTE_COMMAND_ERROR'),
			ephemeral: true,
		};

		switch (interaction.options.getSubcommand()) {
			case 'add':
				const zitat = interaction.options.getString('zitat');
				const time = Date.now();
				const author = interaction.user.id;

				const zitatID = await zitatUtil.addZitat(guildid, zitat, time, author);
				answer = await lang.getString(
					'QUOTE_COMMAND_ADD_ANSWER',
					{ QUOTEID: zitatID },
					guildid
				);

				break;
			case 'delete':
				const toDeleteID = interaction.options.getInteger('id');
				answer = await lang.getString(
					'QUOTE_COMMAND_DELETE_ANSWER_SUCCESS',
					{ QUOTEID: toDeleteID },
					guildid
				);

				if ((await zitatUtil.deleteZitat(toDeleteID, guildid)) == false)
					answer = {
						content: await lang.getString(
							'QUOTE_COMMAND_DELETE_ANSWER_FAIL',
							{ QUOTEID: toDeleteID },
							guildid
						),
						ephemeral: true,
					};

				break;
			case 'import':
				const channelid = interaction.options.getString('channelid');
				const channel = await interaction.guild.channels.cache.get(channelid);

				if (channel == undefined) {
					answer = {
						content: await lang.getString('QUOTE_COMMAND_IMPORT_ANSWER_FAIL'),
						ephemeral: true,
					};

					break;
				}

				interaction.deferReply();

				let messages = await utilities.fetchAllMessages(channel);

				for (message of messages) {
					await zitatUtil.addZitat(
						guildid,
						message.content,
						message.createdTimestamp,
						message.author.id
					);
				}

				answer = await lang.getString(
					'QUOTE_COMMAND_IMPORT_ANSWER_SUCCESS',
					{ CHANNELNAME: channelid },
					guildid
				);

				break;
			case 'list':
				let zitatList = await zitatUtil.charLimitList(guildid);

				if (zitatList[0] == undefined) {
					answer = {
						content: await lang.getString('QUOTE_LIST_NO_QUOTES'),
						ephemeral: true,
					};
					break;
				}

				zitateEmbed = new MessageEmbed()
					.setTitle(
						await lang.getString(
							'QUOTE_LIST_TITLE',
							{ GUILDNAME: interaction.guild.name },
							guildid
						)
					)
					.setDescription(zitatList[0])
					.setTimestamp();

				const nextButtonsDisabled = !(zitatList.length > 1);

				actionRow = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId('zitate-firstPage')
						.setStyle('PRIMARY')
						.setLabel(await await lang.getString('FIRST_PAGE', {}, guildid))
						.setDisabled(true),
					new MessageButton()
						.setCustomId('zitate-previousPage')
						.setStyle('PRIMARY')
						.setLabel(await await lang.getString('PREVIOUS_PAGE', {}, guildid))
						.setDisabled(true),
					new MessageButton()
						.setCustomId('zitate-nextPage')
						.setStyle('PRIMARY')
						.setLabel(await await lang.getString('NEXT_PAGE, {}, guildid'))
						.setDisabled(nextButtonsDisabled),
					new MessageButton()
						.setCustomId('zitate-lastPage')
						.setStyle('PRIMARY')
						.setLabel(await await lang.getString('LAST_PAGE', {}, guildid))
						.setDisabled(nextButtonsDisabled)
				);

				answer = { embeds: [zitateEmbed], components: [actionRow] };

				break;
			case 'random':
				let randomZitat = await zitatUtil.randomZitat(interaction.guild.id);
				let zitatCreator = await interaction.client.users
					.fetch(randomZitat.author)
					.catch(() => {
						return {
							username: await lang.getString(
								'DISCORD_LOST_ACCOUNT',
								{},
								guildid
							),
						};
					});
				let date = new Date(randomZitat.time).toLocaleDateString('de-DE', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
				});

				zitateEmbed = new MessageEmbed()
					.setTitle(await lang.getString('QUOTE_RANDOM', {}, guildid))
					.setDescription(randomZitat.zitat)
					.setFooter({
						text: await lang.getString(
							'QUOTE_RANDOM_FOOTER',
							{
								DATE: date,
								CREATOR: zitatCreator.username,
								QUOTEID: randomZitat.id,
							},
							guildid
						),
					})
					.setColor('YELLOW');

				actionRow = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId('zitate-newRandom')
						.setStyle('PRIMARY')
						.setLabel(await lang.getString('QUOTE_ANOTHER', {}, guildid))
				);
				answer = { embeds: [zitateEmbed], components: [actionRow] };
		}

		if (!interaction.deferred) await interaction.reply(answer);
		else await interaction.editReply(answer);
	},
};
