import TrackList from './TrackList.js';

export default class Album extends TrackList {
	constructor(tracks, title, artists, albumArt, year) {
		super(tracks);
		this.title = title;
		this.artists = artists;
		this.albumArt = albumArt;
		this.year = year;
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
