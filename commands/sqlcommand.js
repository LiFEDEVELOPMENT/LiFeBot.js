const { SlashCommandBuilder } = require("@discordjs/builders")
const { execute } = require("./color")

module.exports = {
    //Creates a new SlashComamnd
    data: new SlashCommandBuilder()
        .setName('sql')
        .setDescription('Führt einen sql Befehl (Query) in der Datenbank aus')
        .addStringOption(option =>
            option.setName('befehl')
                .setDescription('Die Query, die ausgeführt werden soll')
                .setRequired(true)),
    async execute(interaction) {
        import { query } from "../sql.js";
        query(befehl)
    }
}