import QueueObject from './QueueObject';

class Queue extends QueueObject {
	constructor(queue, shuffled) {
		super(queue, shuffled);
	}

	get(index) {
		return this.queue[index];
	}

	getLength() {
		return this.queue.length;
	}

	allPlayed() {
		return this.playedElements.every((element) => element === true);
	}

	isEmpty() {
		return this.queue.length === 0;
	}

	restart() {
		this.playedElements = [];
		this.currentTrack = 0;
	}

	clear() {
		this.queue = [];
		this.playedElements = [];
		this.currentTrack = 0;
	}

	next() {
		if (this.shuffled) {
			if (this.allPlayed()) this.restart();

			let index = Math.floor(Math.random() * this.queue.length);
			while (this.playedElements[index]) {
				index = Math.floor(Math.random() * this.queue.length);
			}

			this.currentTrack = index;
			this.playedElements[index] = true;
			return this.queue[index];
		} else {
			if (this.loop) {
				this.currentTrack = (this.currentTrack + 1) % this.queue.length;
				return this.queue[this.currentTrack];
			} else {
				return this.queue.shift();
			}
		}
	}

	shuffle() {
		this.shuffled = true;
	}

	unshuffle() {
		this.shuffled = false;
	}

	loop() {
		this.loop = true;
	}

	unloop() {
		this.loop = false;
	}
}
