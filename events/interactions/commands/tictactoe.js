const { SlashCommandBuilder, userMention } = require('@discordjs/builders');
const {
	MessageSelectMenu,
	MessageActionRow,
	MessageButton,
} = require('discord.js');
const sql = require('@sql');
const lang = require('@lang');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tictactoe')
		.setDescription(
			'Startet ein TicTacToe Spiel gegen einen User auf diesem Server!'
		)
		.addUserOption((option) =>
			option
				.setName('gegner')
				.setDescription('Der User, gegen den du spielen möchtest!')
				.setRequired(true)
		),
	async execute(interaction) {
		const gegner = interaction.options.getUser('gegner');

		if (gegner.bot) console.log('lolo');
	},
};
