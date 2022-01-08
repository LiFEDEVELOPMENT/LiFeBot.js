const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const zitatUtil = require('@util/ZitatUtil.js');

module.exports = {
	async execute(interaction) {
		let randomZitat = await zitatUtil.randomZitat(interaction.guild.id);
		let zitatCreator = await interaction.client.users
			.fetch(randomZitat.author)
			.catch((err) => {
				return {
					username:
						'einem Discord Account, der leider nicht mehr unter uns ist lol',
				};
			});
		let date = new Date(randomZitat.time).toLocaleDateString('de-DE', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});

		const zitatEmbed = new MessageEmbed()
			.setTitle('Zufälliges Zitat')
			.setDescription(randomZitat.zitat)
			.setFooter({
				text: `Erstellt am ${date} von ${zitatCreator.username} | ID: ${randomZitat.id}`,
			})
			.setColor('YELLOW');

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('zitate-newRandom')
				.setStyle('PRIMARY')
				.setLabel('Noch ein Zitat!')
		);

		interaction.update({
			embeds: [zitatEmbed],
			components: [actionRow],
		});
	},
};
