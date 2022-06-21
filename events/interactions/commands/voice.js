import {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from '@discordjs/builders';
import {
	MessageEmbed,
	MessageActionRow,
	MessageButton,
	Util,
} from 'discord.js';
import lang from '#lang';
import errorMessage from '#errormessage';
import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice';

async function create() {
	const command = new SlashCommandBuilder()
		.setName('voice')
		.setDescription('Voice utility');

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('join')
			.setDescription('Joins the voice channel you are currently in')
	);

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('leave')
			.setDescription('Leaves the voice channel if it is in your voice channel')
	);

	return command.toJSON();
}

async function execute(interaction) {
	const locale = interaction.locale;
	try {
		let answer = {
			content: await lang('ERROR', {}, locale),
			ephemeral: true,
		};

		switch (interaction.options.getSubcommand()) {
			case 'join':
				answer = await joinCommand(interaction);
				break;
			case 'leave':
				answer = await leaveCommand(interaction);
		}

		await interaction.reply(answer);
	} catch (error) {
		errorMessage(interaction, error);
	}
}

async function joinCommand(interaction) {
	const locale = interaction.locale;

	const connection = joinVoiceChannel({
		channelId: interaction.member.voice.channel.id,
		guildId: interaction.guild.id,
		adapterCreator: interaction.guild.voiceAdapterCreator,
		selfDeaf: true,
	});

	return await lang('VOICE_JOIN_SUCCESS', {}, locale);
}

async function leaveCommand(interaction) {
	const locale = interaction.locale;

	const connection = getVoiceConnection(interaction.guild.id);

	connection.destroy();

	return await lang('VOICE_LEAVE_SUCCESS', {}, locale);
}

export { create, execute };
