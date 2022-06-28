import Track from './Track.js';

export default class Playlist {
	constructor(tracks, title, author, description, image) {
		this.tracks = tracks.items.map((item) => new Track(item.track));
		this.title = title;
		this.author = author;
		this.description = description;
		this.image = image;
	}

	getTracks() {
		return this.tracks;
	}

	getTrack(index) {
		return this.tracks[index];
	}

	getLength() {
		return this.tracks.length;
	}

	getTitle() {
		return this.title;
	}

	getAuthor() {
		return this.author;
	}

	getDescription() {
		return this.description;
	}

	getImage() {
		return this.image;
	}
}
