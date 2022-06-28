import ytdl from 'ytdl-core';
import search from 'yt-search';

export default class Track {
	constructor(track) {
		this.track = track;
	}

	getTitle() {
		return this.track.name;
	}

	getArtists() {
		return this.track.artists.map((artist) => artist.name).join(', ');
	}

	getAlbum() {
		return this.track.album.name;
	}

	getAlbumArt() {
		return this.track.album.images[0].url;
	}

	getDuration() {
		return this.track.duration_ms;
	}

	getUrl() {
		return this.track.external_urls.spotify;
	}

	getYouTubeUrl() {
		return search(`${this.getTitle()} - ${this.getArtists()} lyrics`).videos[0]
			.url;
	}

	stream() {
		return ytdl(this.getYouTubeUrl(), {
			filter: 'audioonly',
			quality: 'highestaudio',
		});
	}
}
