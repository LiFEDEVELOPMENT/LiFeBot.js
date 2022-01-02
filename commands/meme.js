const {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const memeUtil = require('../utility/MemeUtil.js');
const utilities = require('../utility/Utilities.js');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription(
			'Meme-Commandgruppe. Enthält Subcommands für hinzufügen, löschen und anzeigen der Memes.'
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('random')
				.setDescription('Zeigt ein zufälliges Meme des Servers!')
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('add')
				.setDescription('Fügt ein Meme hinzu!')
				.addStringOption((option) =>
					option
						.setName('meme')
						.setDescription('Das Meme, welches hinzugefügt werden soll.')
						.setRequired(true)
				)
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('delete')
				.setDescription('Entfernt ein Meme!')
				.addIntegerOption((option) =>
					option
						.setName('id')
						.setDescription('Die ID des Memes, welches entfernt werden soll.')
						.setRequired(true)
				)
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('list')
				.setDescription('Zeigt eine Liste aller Memes dieses Servers!')
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
				const meme = interaction.options.getString('meme');

				const memeID = await memeUtil.addMeme(guildid, meme);
				answer = `Das Meme wurde erfolgreich hinzugefügt! Es hat die ID ${memeID}`;

				break;
			case 'delete':
				const toDeleteID = interaction.options.getInteger('id');
				answer = `Das Meme mit der ID ${toDeleteID} wurde erfolgreich entfernt!`;

				if ((await memeUtil.deleteMeme(toDeleteID, guildid)) == false)
					answer = {
						content: `Hoppla! Auf diesem Server scheint es kein Meme mit der ID ${toDeleteID} zu geben!`,
						ephemeral: true,
					};

				break;
			case 'list':
				let memeList = await memeUtil.charLimitList(guildid);

				if (memeList[0] == undefined) {
					answer = {
						content: 'Auf diesem Server scheint es keine Memes zu geben :(',
						ephemeral: true,
					};
					break;
				}

				const memeEmbed = new MessageEmbed()
					.setTitle(`Alle Memes von ${interaction.guild.name} - Seite 1`)
					.setDescription(memeList[0])
					.setTimestamp();

				const nextButtonsDisabled = !(memeList.length > 1);

				actionRow = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId('memes-firstPage')
						.setStyle('PRIMARY')
						.setLabel('Erste Seite!')
						.setDisabled(true),
					new MessageButton()
						.setCustomId('memes-previousPage')
						.setStyle('PRIMARY')
						.setLabel('Vorherige Seite!')
						.setDisabled(true),
					new MessageButton()
						.setCustomId('memes-nextPage')
						.setStyle('PRIMARY')
						.setLabel('Nächste Seite!')
						.setDisabled(nextButtonsDisabled),
					new MessageButton()
						.setCustomId('memes-lastPage')
						.setStyle('PRIMARY')
						.setLabel('Letzte Seite!')
						.setDisabled(nextButtonsDisabled)
				);

				answer = { embeds: [memeEmbed], components: [actionRow] };

				break;
			case 'random':
				let randomMeme = await memeUtil.randomMeme(interaction.guild.id);

				const memeEmbed = new MessageEmbed()
					.setTitle('Zufälliges Meme')
					.setDescription(randomMeme.meme)
					.setFooter(`ID: ${randomMeme.id}`)
					.setColor('ORANGE');

				actionRow = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId('memes-newRandom')
						.setStyle('PRIMARY')
						.setLabel('Noch ein Meme!')
				);
				answer = { embeds: [memeEmbed], components: [actionRow] };

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
