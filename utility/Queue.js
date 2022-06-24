import {} from 'dotenv/config';
import ytdl from 'ytdl-core';
import SpotifyWebApi from 'spotify-web-api-node';
import search from 'yt-search';

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

async function enqueue(url, interaction) {
	if (url == '') throw new Error('No url provided');
}

async function dequeue(interaction) {}

async function stream(url) {
	return ytdl(url, {
		filter: 'audioonly',
	});
}

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

export default { enqueue, dequeue, stream, searchToUrl };
