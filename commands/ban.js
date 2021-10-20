const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannt einen User vom Server!')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Der User, der ebannt werden soll')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Der Grund, weswegen der angegebene User gebannt wird')
                .setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getUser('target')
        const member = interaction.guild.members.cache.get(target.id) || await interaction.guild.members.fetch(target.id).catch(err => { })
        const reason = interaction.options.getString('reason') != null ? interaction.options.getString('reason') : "No reason provided"
        const moderator = interaction.member.nickname != null ? `${interaction.member.nickname}` : `${interaction.member.user.username}`

        const banEmbed = new MessageEmbed()
            .setTitle(`${member.user.tag}`)
            .setDescription(`Wurde vom Server gebannt. Reason:\n\`${reason}\``)
            .setColor("RED")
            .setFooter(moderator)
            .setTimestamp()

        const banMessage = `Du wurdest von **${interaction.guild.name}** gebannt. Reason:\n\`${reason}\``

        if (!member)
            return interaction.reply("Beim Abrufen dieses Users ist ein Fehler aufgetreten!");
        if (!member.bannable || member.user.id === interaction.client.user.id)
            return interaction.reply("Dieser User kann nicht gebannt werden!");
        if (interaction.member.roles.highest.position <= member.roles.highest.position || !interaction.member.permissions.has("BAN_MEMBERS"))
            return interaction.reply('Du hast nicht die Berechtigung, diesen User zu bannen')

        await member.user.send(banMessage).catch(err => { console.log(err) })
        member.kick({ reason })

        await interaction.reply({ embeds: [banEmbed] })
    }
}