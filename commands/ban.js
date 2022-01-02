const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	// Creates a new SlashCommand
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bannt einen User vom Server!')
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('Der User, der gebannt werden soll')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('reason')
				.setDescription('Der Grund, weswegen der angegebene User gebannt wird')
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

		// Prepares an MessageEmbed containing information about the ban
		const banEmbed = new MessageEmbed()
			.setTitle(`${member.user.tag}`)
			.setDescription(`Wurde vom Server gebannt. Reason:\n\`${reason}\``)
			.setColor('RED')
			.setFooter(moderator)
			.setTimestamp();

		// Creates a message for the target user informing him about his ban
		const banMessage = `Du wurdest von **${interaction.guild.name}** gebannt. Reason:\n\`${reason}\``;

		// Checks if the executor has the permissions to ban the target and the target can be banned
		if (!member)
			return interaction.reply(
				'Beim Abrufen dieses Users ist ein Fehler aufgetreten!'
			);
		if (!member.bannable || member.user.id === interaction.client.user.id)
			return interaction.reply(
				'Diesen User werde ich nicht für dich bannen! lol'
			);
		if (
			interaction.member.roles.highest.position <=
				member.roles.highest.position ||
			!interaction.member.permissions.has('BAN_MEMBERS')
		)
			return interaction.reply(
				'Du hast nicht die Berechtigung, diesen User zu bannen!'
			);

		// Sends the previously created banMessage via DM and bans the target
		await member.user.send(banMessage).catch((err) => {
			console.err(err);
		});
		await member.ban({ reason });

		await interaction.reply({ embeds: [banEmbed] });
	},
};
