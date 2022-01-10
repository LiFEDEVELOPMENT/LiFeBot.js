const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const zitatUtil = require('@util/ZitatUtil.js');
const lang = require('@lang');

module.exports = {
	async execute(interaction) {
		const guildid = interaction.guild.id;
		let randomZitat = await zitatUtil.randomZitat(interaction.guild.id);
		let zitatCreator = await interaction.client.users
			.fetch(randomZitat.author)
			.catch((err) => {
				return {
					username: await lang.getString('DISCORD_LOST_ACCOUNT', {}, guildid),
				};
			});
		let date = new Date(randomZitat.time).toLocaleDateString('de-DE', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});

		const zitatEmbed = new MessageEmbed()
			.setTitle(await lang.getString('QUOTE_RANDOM', {}, guildid))
			.setDescription(randomZitat.zitat)
			.setFooter({
				text: await lang.getString(
					'QUOTE_RANDOM_FOOTER',
					{
						DATE: date,
						CREATOR: zitatCreator.username,
						QUOTEID: randomZitat.id,
					},
					guildid
				),
			})
			.setColor('YELLOW');

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('zitate-newRandom')
				.setStyle('PRIMARY')
				.setLabel(await lang.getString('QUOTE_ANOTHER', {}, guildid))
		);

		interaction.update({
			embeds: [zitatEmbed],
			components: [actionRow],
		});
	},
};
