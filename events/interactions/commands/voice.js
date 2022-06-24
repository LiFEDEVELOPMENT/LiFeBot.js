import {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from '@discordjs/builders';
import lang from '#lang';
import errorMessage from '#errormessage';
import {
	joinVoiceChannel,
	getVoiceConnection,
	createAudioResource,
	createAudioPlayer,
} from '@discordjs/voice';
import path from 'path';
import { fileURLToPath } from 'url';
import queue from '#util/Queue';

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

	command.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('play')
			.setDescription('Plays a song')
			.addStringOption((option) =>
				option
					.setName('song')
					.setDescription('The song you want to play')
					.setRequired(true)
			)
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
			case 'play':
				answer = await playCommand(interaction);
				break;
			case 'join':
				answer = await joinCommand(interaction);
				break;
			case 'leave':
				answer = await leaveCommand(interaction);
		}

		await interaction.reply(answer);
	} catch (error) {
		// errorMessage(interaction, error);
		console.log(error);
	}
}

async function playCommand(interaction) {
	const locale = interaction.locale;
	try {
		const url = await queue.searchToUrl(interaction.options.getString('song'));
		if (url == null) throw new Error('No url found');
		const connection = joinVoiceChannel({
			channelId: interaction.member.voice.channel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
			selfDeaf: true,
		});
		const resource = createAudioResource(await queue.stream(url));
		const player = createAudioPlayer();
		player.play(resource);
		connection.subscribe(player);
		return await lang('VOICE_PLAY_SUCCESS', {}, locale);
	} catch (error) {
		console.log(error);
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

	const player = createAudioPlayer();

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	// const resource = createAudioResource(
	// 	path.join(__dirname, '../../../utility/Song.mp3')
	// );
	const resource = createAudioResource(
		await queue.stream('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
	);

	player.play(resource);

	connection.subscribe(player);

	return await lang('VOICE_JOIN_SUCCESS', {}, locale);
}

async function leaveCommand(interaction) {
	const locale = interaction.locale;

	const connection = getVoiceConnection(interaction.guild.id);

	connection.destroy();

	return await lang('VOICE_LEAVE_SUCCESS', {}, locale);
}

export { create, execute };
