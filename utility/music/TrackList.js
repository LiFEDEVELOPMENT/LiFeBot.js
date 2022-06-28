import Track from './Track.js';

export default class TrackList {
	constructor(tracks) {
		this.tracks = tracks.items.map((item) => new Track(item.track));
		this.shuffle = false;
		this.currentTrack = 0;
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

	allPlayed() {
		return this.tracks
			.map((track) => track.getPlayed())
			.every((state) => state === true);
	}

	getShuffle() {
		return this.shuffle;
	}

	setShuffle(state) {
		this.shuffle = state;
	}

	restart() {
		for (let i = 0; i < this.tracks.length; i++) {
			this.tracks[i].setPlayed(false);
		}
		this.currentTrack = 0;
	}

	nextTrack() {
		if (this.allPlayed()) return null;

		if (this.shuffle) {
			while (this.tracks[this.currentTrack].getPlayed()) {
				this.currentTrack = Math.floor(Math.random() * this.tracks.length);
			}
		} else {
			this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
		}

		this.tracks[this.currentTrack].setPlayed(true);
		return this.tracks[this.currentTrack];
	}
}
