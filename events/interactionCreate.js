const execute = async (interaction) => {
	if (interaction.isChatInputCommand())
		return (await import(`#commands/${interaction.commandName}`)).execute(
			interaction
		);

	const metadata = interaction.customId.split('-');
	const name = metadata.shift();

	if (interaction.isButton())
		return (await import(`#buttons/${name}`)).execute(interaction, ...metadata);

	if (interaction.isSelectMenu())
		return (await import(`#menus/${name}`)).execute(interaction, ...metadata);
};

const once = false;
const name = 'interactionCreate';

export { name, once, execute };
