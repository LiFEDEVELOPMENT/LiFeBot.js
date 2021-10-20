const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    // Creates a new SlashCommand
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Announced eine Nachricht!')
        .addStringOption(option =>
            option.setName('nachricht')
                .setDescription('Die Nachricht, die announced werden soll')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('rolle')
                .setDescription('Die Rolle, die in der Nachricht erwähnt werden soll')
                .setRequired(false)),
    async execute(interaction) {
        // Prepare MessageEmbed for the announce
        const announceEmbed = new MessageEmbed()
            .setColor("YELLOW")
            .setTitle('Announce')
            .setDescription((interaction.options.getRole('rolle') != null ? "<@&" + interaction.options.getRole('rolle') + "> \n\n" : "") + interaction.options.getString('nachricht'))
            .setFooter(interaction.member.nickname != null ? `${interaction.member.nickname}` : `${interaction.member.user.username}`)

        // Send the MessageEmbed and reply with a confirmation for the executor
        await interaction.channel.send({ embeds: [announceEmbed] })
        await interaction.reply({ content: 'Die Nachricht wurde announced!', ephemeral: true })
    },
};