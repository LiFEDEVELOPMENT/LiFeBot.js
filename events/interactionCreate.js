const execute = async (interaction) => {
	if (interaction.isChatInputCommand())
		return (await import(`#commands/${interaction.commandName}`)).execute(
			interaction
		);

	const metadata = interaction.customId.split('-');

	if (interaction.isButton())
		return (await import(`#buttons/${metadata[0]}`)).execute(
			interaction,
			metadata[1]
		);

	if (interaction.isSelectMenu())
		return (await import(`#menus/${metadata[0]}`)).execute(
			interaction,
			metadata[1]
		);
};

const once = false;
const name = 'interactionCreate';

export { name, once, execute };
