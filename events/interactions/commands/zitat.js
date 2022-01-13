import {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from '@discordjs/builders';
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import zitatUtil from '@util/ZitatUtil.js';
import utilities from '@util/Utilities.js';
import lang from '@lang';

async function create() {
	const command = new SlashCommandBuilder()
		.setName(await lang('QUOTE_COMMAND_NAME'))
		.setDescription(await lang('QUOTE_COMMAND_DESCRIPTION'));

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('random')
			.setDescription(await lang('QUOTE_COMMAND_RANDOM_DESCRIPTION'))
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('add')
			.setDescription(await lang('QUOTE_COMMAND_ADD_DESCRIPTION'))
			.addStringOption((option) =>
				option
					.setName(await lang('QUOTE_COMMAND_NAME'))
					.setDescription(await lang('QUOTE_COMMAND_ADD_QUOTE_DESCRIPTION'))
					.setRequired(true)
			)
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('delete')
			.setDescription(await lang('QUOTE_COMMAND_DELETE_DESCRIPTION'))
			.addIntegerOption((option) =>
				option
					.setName('id')
					.setDescription(await lang('QUOTE_COMMAND_DELETE_ID_DESCRIPTION'))
					.setRequired(true)
			)
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('list')
			.setDescription(await lang('QUOTE_COMMAND_LIST_DESCRIPTION'))
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('import')
			.setDescription(await lang('QUOTE_COMMAND_IMPORT_DESCRIPTION'))
			.addStringOption((option) =>
				option
					.setName('channelid')
					.setDescription(await lang('QUOTE_COMMAND_IMPORT_ID_DESCRIPTION'))
					.setRequired(true)
			)
	);

	return command.toJSON();
}

async function execute(interaction) {
	try {
		const guildid = interaction.member.guild.id;
		let actionRow;
		let zitateEmbed;
		let answer = {
			content: await lang.get('ERROR'),
			ephemeral: true,
		};

		switch (interaction.options.getSubcommand()) {
			case 'add':
				answer = await addCommand(interaction, guildid);
				break;
			case 'delete':
				answer = await deleteCommand(interaction, guildid);

				break;
			case 'import':
				answer = await importCommand(interaction, guildid);

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
		const zitat = interaction.options.getString(
			await lang('QUOTE_COMMAND_NAME')
		);
		const time = Date.now();
		const author = interaction.user.id;

		const zitatID = await zitatUtil.addZitat(guildid, zitat, time, author);
		return await lang(
			'QUOTE_EXECUTE_ADD_SUCCESS',
			{ QUOTEID: zitatID },
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

async function deleteCommand(interaction, guildid) {
	try {
		const toDeleteID = interaction.options.getInteger('id');

		if ((await zitatUtil.deleteZitat(toDeleteID, guildid)) == false)
			return {
				content: await lang(
					'QUOTE_EXECUTE_DELETE_ERROR',
					{ QUOTEID: toDeleteID },
					guildid
				),
				ephemeral: true,
			};

		return await lang(
			'QUOTE_EXECUTE_DELETE_SUCCESS',
			{ QUOTEID: toDeleteID },
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

async function importCommand(interaction, guildid) {
	try {
		const channelid = interaction.options.getString('channelid');
		const channel = await interaction.guild.channels.cache.get(channelid);

		if (channel == undefined)
			return {
				content: await lang('QUOTE_EXECUTE_IMPORT_ERROR'),
				ephemeral: true,
			};

		interaction.deferReply();

		let messages = await utilities.fetchAllMessages(channel);

		for (let message of messages) {
			await zitatUtil.addZitat(
				guildid,
				message.content,
				message.createdTimestamp,
				message.author.id
			);
		}

		return await lang(
			'QUOTE_EXECUTE_IMPORT_SUCCESS',
			{ CHANNELNAME: channelid },
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
		let zitatList = await zitatUtil.charLimitList(guildid);

		if (zitatList[0] == undefined)
			return {
				content: await lang('QUOTE_EXECUTE_LIST_REPLY_NO_QUOTES'),
				ephemeral: true,
			};

		zitateEmbed = new MessageEmbed()
			.setTitle(
				await lang(
					'QUOTE_EXECUTE_LIST_EMBED_TITLE',
					{ GUILDNAME: interaction.guild.name },
					guildid
				)
			)
			.setDescription(zitatList[0])
			.setTimestamp();

		const nextButtonsDisabled = !(zitatList.length > 1);

		actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('zitate/firstPage')
				.setStyle('PRIMARY')
				.setLabel(await await lang('FIRST_PAGE', {}, guildid))
				.setDisabled(true),
			new MessageButton()
				.setCustomId('zitate/previousPage')
				.setStyle('PRIMARY')
				.setLabel(await await lang('PREVIOUS_PAGE', {}, guildid))
				.setDisabled(true),
			new MessageButton()
				.setCustomId('zitate/nextPage')
				.setStyle('PRIMARY')
				.setLabel(await lang('NEXT_PAGE', {}, guildid))
				.setDisabled(nextButtonsDisabled),
			new MessageButton()
				.setCustomId('zitate/lastPage')
				.setStyle('PRIMARY')
				.setLabel(await await lang('LAST_PAGE', {}, guildid))
				.setDisabled(nextButtonsDisabled)
		);

		return { embeds: [zitateEmbed], components: [actionRow] };
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
		let randomZitat = await zitatUtil.randomZitat(interaction.guild.id);
		let zitatCreator = await interaction.client.users
			.fetch(randomZitat.author)
			.catch(() => {
				return {
					username: await lang('DISCORD_LOST_ACCOUNT', {}, guildid),
				};
			});
		let date = new Date(randomZitat.time).toLocaleDateString('de-DE', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});

		zitateEmbed = new MessageEmbed()
			.setTitle(await lang('QUOTE_EXECUTE_RANDOM_EMBED_TITLE', {}, guildid))
			.setDescription(randomZitat.zitat)
			.setFooter({
				text: await lang(
					'QUOTE_EXECUTE_RANDOM_EMBED_FOOTER',
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
				.setCustomId('zitate/newRandom')
				.setStyle('PRIMARY')
				.setLabel(await lang('QUOTE_EXECUTE_RANDOM_BUTTON_TITLE', {}, guildid))
		);
		return { embeds: [zitateEmbed], components: [actionRow] };
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: await lang('ERROR'),
			ephemeral: true,
		});
	}
}

export default { create, execute };
