const {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const sql = require('../db/sql.js');
const zitatUtil = require('../utility/zitatutil.js');
const dateUtil = require('../utility/DateUtil.js');

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
				.addNumberOption((option) =>
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
		let message =
			'Wenn du diese Nachricht siehst, habe ich irgendwas verkackt lool';
		let message = {
			content: `Wenn du diese Nachricht siehst, ist irgendwas schief gelaufen...`,
			ephemeral: true,
		};

		switch (interaction.options.getSubcommand()) {
			case 'add':
				const zitat = interaction.options.getString('zitat');
				const time = Date.now();
				const author = interaction.user.id;
				const zitatID = await zitatUtil.addZitat(guildid, zitat, time, author);
				message = `Das Zitat wurde erfolgreich hinzugefügt! Es hat die ID ${zitatID}`;
				break;
			case 'delete':
				const id = interaction.options.getNumber('id');
				const id = interaction.options.getInteger('id');
				message = `Das Zitat mit der ID ${id} wurde erfolgreich entfernt!`;
				if ((await zitatUtil.deleteZitat(id, guildid)) == false)
					message = {
						content: `Hoppla! Auf diesem Server scheint es kein Zitat mit der ID ${id} zu geben!`,
						ephemeral: true,
					};
				break;
			case 'import':
				const channelid = interaction.options.getString('channelid');
				const channel = await interaction.guild.channels.cache.get(channelid);
				let messages = await channel.messages.fetch();

				messages = Array.from(messages).reverse();

				for (m of messages) {
					await zitatUtil.addZitat(
						guildid,
						m[1].content,
						m[1].createdTimestamp,
						m[1].author.id
					);
				}

				message = `Alle Nachrichten aus ${channel.name} wurden als Zitat hinzugefügt!`;
				break;
			case 'list':
				let zitatList = await zitatUtil.charLimitList(guildid);

				const zitateEmbed = new MessageEmbed()
					.setTitle(`Alle Zitate von ${interaction.guild.name} - Seite 1`)
					.setDescription(zitatList[0])
					.setTimestamp();

				message = { embeds: [zitateEmbed] };
				break;
			case 'random':
				let randomZitat = await zitatUtil.randomZitat(interaction.guild.id);
				let zitatCreator = await interaction.client.users.fetch(
					randomZitat.author
				);
				let date = await dateUtil.formatDate(new Date(randomZitat.time));

				const zitatEmbed = new MessageEmbed()
					.setTitle('Zufälliges Zitat')
					.setDescription(randomZitat.zitat)
					.setFooter(
						`Erstellt am ${date} von ${zitatCreator.username} | ID: ${randomZitat.id}`
					)
					.setColor('YELLOW');
				message = { embeds: [zitatEmbed] };

				break;
			default:
				console.log(
					'Hoppla, da wurde ein nicht-existierender Subcommand ausgeführt!'
				);
				message = {
					content: `Wenn du diese Nachricht siehst, ist irgendwas schief gelaufen...`,
					ephemeral: true,
				};
		}
		await interaction.reply(message);
	},
};
