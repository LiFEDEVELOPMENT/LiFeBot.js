const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kickt einen User vom Server')
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('Der User, der gekickt werden soll')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('reason')
				.setDescription('Der Grund, weswegen der angegebene User gekickt wird')
				.setRequired(false)
		),
	async execute(interaction) {
		// Prepares constants for the information in the confirmation MessageEmbed
		const target = interaction.options.getUser('target');
		const member =
			interaction.guild.members.cache.get(target.id) ||
			(await interaction.guild.members.fetch(target.id).catch((err) => {}));
		const reason =
			interaction.options.getString('reason') != null
				? interaction.options.getString('reason')
				: 'Es wurde kein Grund angegeben';
		const moderator =
			interaction.member.nickname != null
				? `${interaction.member.nickname}`
				: `${interaction.member.user.username}`;

		// Prepares an MessageEmbed containing information about the kick
		const kickEmbed = new MessageEmbed()
			.setTitle(`${member.user.tag}`)
			.setDescription(`Wurde vom Server gekickt. Reason:\n\`${reason}\``)
			.setColor('RED')
			.setFooter(moderator)
			.setTimestamp();

		// Creates a message for the target user informing him about his kick
		const kickMessage = `Du wurdest von **${interaction.guild.name}** gekickt. Reason:\n\`${reason}\``;

		// Checks if the executor has the permissions to kick the target and the target can be kicked
		if (!member)
			return interaction.reply(
				'Beim Abrufen dieses Users ist ein Fehler aufgetreten!'
			);
		if (!member.kickable || member.user.id === interaction.client.user.id)
			return interaction.reply('Dieser User kann nicht gekickt werden!');
		if (
			interaction.member.roles.highest.position <=
				member.roles.highest.position ||
			!interaction.member.permissions.has('KICK_MEMBERS')
		)
			return interaction.reply(
				'Du hast nicht die Berechtigung, diesen User zu kicken'
			);

		// Sends the previously created banMessage via DM and kicks the target
		await member.user.send(kickMessage).catch((err) => {
			console.log(err);
		});
		member.kick({ reason });

		// Sends the previously created MessageEmbed to the server
		await interaction.reply({ embeds: [kickEmbed] });
	},
};
