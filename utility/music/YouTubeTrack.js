import ytdl from 'ytdl-core';

export default class YouTubeTrack {
	//TODO: YouTube Playlist parsing
	constructor(track) {
		this.track = track;
	}

	getTitle() {
		return this.track.title;
	}

	getArtists() {
		return this.track.author.name;
	}

	getAlbum() {
		return this.track.title;
	}

	getAlbumArt() {
		return this.track.thumbnail;
	}

	getDuration() {
		return this.track.duration.seconds * 1000;
	}

	getUrl() {
		return this.track.url;
	}

	stream() {
		return ytdl(this.getUrl(), {
			filter: 'audioonly',
			quality: 'highestaudio',
		});
	}
}
