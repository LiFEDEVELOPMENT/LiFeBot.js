const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Wift eine Münze!'),
    async execute(interaction) {
        interaction.reply(Math.random() < 0.5 ? "Zahl" : "Kopf")
    }
}