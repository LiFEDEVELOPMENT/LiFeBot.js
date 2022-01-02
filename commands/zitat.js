const {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const zitatUtil = require('../utility/ZitatUtil.js');
const utilities = require('../utility/Utilities.js');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('zitat')
		.setDescription(
			'Zitat-Commandgruppe. Enthält Subcommands für hinzufügen, löschen und anzeigen der Zitate.'
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('random')
				.setDescription('Zeigt ein zufälliges Zitat des Servers!')
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('add')
				.setDescription('Fügt ein Zitat hinzu!')
				.addStringOption((option) =>
					option
						.setName('zitat')
						.setDescription('Das Zitat, welches hinzugefügt werden soll.')
						.setRequired(true)
				)
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('delete')
				.setDescription('Entfernt ein Zitat!')
				.addIntegerOption((option) =>
					option
						.setName('id')
						.setDescription('Die ID des Zitats, welches entfernt werden soll.')
						.setRequired(true)
				)
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('list')
				.setDescription('Zeigt eine Liste aller Zitate dieses Servers!')
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('import')
				.setDescription('Importiert alle Nachrichten eines Kanals als Zitate!')
				.addStringOption((option) =>
					option
						.setName('channelid')
						.setDescription(
							'Die ID des Channels, welcher importiert werden soll'
						)
						.setRequired(true)
				)
		),
	async execute(interaction) {
		const guildid = interaction.member.guild.id;
		let actionRow;
		let answer = {
			content: `Wenn du diese Nachricht siehst, ist irgendwas sehr schief gelaufen...`,
			ephemeral: true,
		};

		switch (interaction.options.getSubcommand()) {
			case 'add':
				const zitat = interaction.options.getString('zitat');
				const time = Date.now();
				const author = interaction.user.id;

				const zitatID = await zitatUtil.addZitat(guildid, zitat, time, author);
				answer = `Das Zitat wurde erfolgreich hinzugefügt! Es hat die ID ${zitatID}`;

				break;
			case 'delete':
				const toDeleteID = interaction.options.getInteger('id');
				answer = `Das Zitat mit der ID ${toDeleteID} wurde erfolgreich entfernt!`;

				if ((await zitatUtil.deleteZitat(toDeleteID, guildid)) == false)
					answer = {
						content: `Hoppla! Auf diesem Server scheint es kein Zitat mit der ID ${toDeleteID} zu geben!`,
						ephemeral: true,
					};

				break;
			case 'import':
				const channelid = interaction.options.getString('channelid');
				const channel = await interaction.guild.channels.cache.get(channelid);

				if (channel == undefined) {
					answer = {
						content: 'Das scheint keine gültige ChannelID zu sein!',
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

				answer = `Alle Nachrichten aus #${channel.name} wurden als Zitat hinzugefügt!`;

				break;
			case 'list':
				let zitatList = await zitatUtil.charLimitList(guildid);

				if (zitatList[0] == undefined) {
					answer = {
						content: 'Auf diesem Server scheint es keine Zitate zu geben :(',
						ephemeral: true,
					};
					break;
				}

				const zitateEmbed = new MessageEmbed()
					.setTitle(`Alle Zitate von ${interaction.guild.name} - Seite 1`)
					.setDescription(zitatList[0])
					.setTimestamp();

				const nextButtonsDisabled = !(zitatList.length > 1);

				actionRow = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId('zitate-firstPage')
						.setStyle('PRIMARY')
						.setLabel('Erste Seite!')
						.setDisabled(true),
					new MessageButton()
						.setCustomId('zitate-previousPage')
						.setStyle('PRIMARY')
						.setLabel('Vorherige Seite!')
						.setDisabled(true),
					new MessageButton()
						.setCustomId('zitate-nextPage')
						.setStyle('PRIMARY')
						.setLabel('Nächste Seite!')
						.setDisabled(nextButtonsDisabled),
					new MessageButton()
						.setCustomId('zitate-lastPage')
						.setStyle('PRIMARY')
						.setLabel('Letzte Seite!')
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
							username:
								'einem Discord Account, der leider nicht mehr unter uns ist lol',
						};
					});
				let date = new Date(randomZitat.time).toLocaleDateString('de-DE', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
				});

				const zitatEmbed = new MessageEmbed()
					.setTitle('Zufälliges Zitat')
					.setDescription(randomZitat.zitat)
					.setFooter(
						`Erstellt am ${date} von ${zitatCreator.username} | ID: ${randomZitat.id}`
					)
					.setColor('YELLOW');

				actionRow = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId('zitate-newRandom')
						.setStyle('PRIMARY')
						.setLabel('Noch ein Zitat!')
				);
				answer = { embeds: [zitatEmbed], components: [actionRow] };

				break;
			default:
				console.log(
					'Hoppla, da wurde ein nicht-existierender Subcommand ausgeführt!'
				);
		}

		if (!interaction.deferred) await interaction.reply(answer);
		else await interaction.editReply(answer);
	},
};
