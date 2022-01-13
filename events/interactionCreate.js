async function execute(interaction) {
	if (interaction.isCommand())
		return (await import(`#commands/${interaction.commandName}`)).execute(
			interaction
		);

	if (interaction.isButton())
		return (await import(`#commands/${interaction.customId}`)).execute(
			interaction
		);

	if (interaction.isSelectMenu()) {
		const customId = interaction.customId.split('-');
		return (await import(`#menus/${customId[0]}`)).execute(
			interaction,
			customId[1]
		);
	}
}

const once = false;
const name = 'interactionCreate';

export default { name, once, execute };
