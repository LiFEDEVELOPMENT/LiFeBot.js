import Track from './Track.js';

export default class Album {
	constructor(tracks, title, artists, albumArt, year) {
		this.tracks = tracks.tracks.items.map((item) => new Track(item));
		this.title = title;
		this.artists = artists;
		this.albumArt = albumArt;
		this.year = year;
	}

	getTracks() {
		return this.tracks;
	}

	getTrack(index) {
		return this.tracks[index];
	}

	getTitle() {
		return this.title;
	}

	getArtists() {
		return this.artists.map((artist) => artist.name).join(', ');
	}

	getAlbumArt() {
		return this.albumArt;
	}

	getYear() {
		return this.year;
	}
}
