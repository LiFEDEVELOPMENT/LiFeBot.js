const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
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
        console.log(interaction.member)
        const announceEmbed = new MessageEmbed()
            .setColor('#FFFF00')
            .setTitle('Announce')
            .setDescription((interaction.options.getRole('rolle') != null ? "<@&" + interaction.options.getRole('rolle') + "> \n\n" : "") + interaction.options.getString('nachricht'))
            .setFooter(interaction.member.nickname != null ? `${interaction.member.nickname}` : `${interaction.member.user.username}`)
        await interaction.channel.send({ embeds: [announceEmbed] })
        await interaction.reply({ content: 'Die Nachricht wurde announced!', ephemeral: true })
    },
};