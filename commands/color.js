const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    // Creates a new SlashCommand
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('Sendet ein Bild der angegeben Farbe')
        .addStringOption(option =>
            option.setName('hex')
                .setDescription('The hex code of the color you want displayed. Please use the format #RRGGBB')
                .setDescription('Der Hex Code der Farbe, welche du sehen möchtest. Bitte benutze das Format #RRGGBB')
                .setRequired(true)),
    async execute(interaction) {
        try {
            // Save color as #RRGGBB, regardless of the color being in the format #RRGGBB or just RRGGBB
            const color = '#' + (interaction.options.getString('hex').startsWith('#') ? interaction.options.getString('hex').substring(1) : interaction.options.getString('hex'));

            // Creates an MessageEmbed with the #RRGGBB as a title and a picture/surface with that color
            const colorEmbed = new MessageEmbed()
                .setTitle(color)
                .setColor(color)
                .setThumbnail("https://singlecolorimage.com/get/" + color.substring(1) + "/400x400");

            //Sends that MessageEmbed
            interaction.reply({ embeds: [colorEmbed] });
        } catch (error) {
            // Catches any formatting mistakes by the executor and replys an error
            interaction.reply('Hopla, da ist etwas schief gelaufen!');
        }
    }
}