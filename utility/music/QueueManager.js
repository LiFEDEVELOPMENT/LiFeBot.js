import {} from 'dotenv/config';
import ytdl from 'ytdl-core';
import SpotifyWebApi from 'spotify-web-api-node';
import search from 'yt-search';
import Track from './Track.js';

const queueMap = new Map();

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

async function enqueue(url, interaction) {
	if (url == '') throw new Error('No url provided');

	if (!queueMap.has(interaction.guild.id)) {
		queueMap.set(interaction.guild.id);
	}
}

async function dequeue(interaction) {}

async function searchToUrl(query) {
	try {
		if (spotifyApi.getAccessToken() === undefined)
			await generateSpotifyAccessToken();
		const spotifyResult = await spotifyApi.searchTracks(query);
		const resultToSearchString = `${spotifyResult.body.tracks.items[0].name}
		 - ${spotifyResult.body.tracks.items[0].artists[0].name} lyrics`;

		const youTubeResults = await search(resultToSearchString);
		return youTubeResults.videos[0].url;
	} catch (error) {
		return null;
	}
}

async function generateSpotifyAccessToken() {
	await spotifyApi.clientCredentialsGrant().then(
		function (data) {
			// Save the access token so that it's used in future calls
			spotifyApi.setAccessToken(data.body['access_token']);
		},
		function (err) {
			console.log('Something went wrong when retrieving an access token', err);
		}
	);
}

export default { enqueue, dequeue, searchToUrl };
