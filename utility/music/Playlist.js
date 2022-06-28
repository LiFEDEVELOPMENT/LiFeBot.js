import TrackList from './TrackList.js';

export default class Playlist extends TrackList {
	constructor(tracks, title, author, description, image, shuffle) {
		super(tracks);
		this.title = title;
		this.author = author;
		this.description = description;
		this.image = image;
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
