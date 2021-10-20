const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    // Creates a new SlashCommand
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Wift eine Münze!'),
    async execute(interaction) {
        // Replys with "Kopf" or "Zahl" with a chance of 50%
        interaction.reply(Math.random() < 0.5 ? "Zahl" : "Kopf");
    }
}