class QueueObject {
	constructor(queue, shuffled) {
		this.queue = [];
		this.shuffled = false;
		this.playedElements = [];
		this.loop = false;
		this.currentTrack = 0;
	}

	add(element) {
		this.queue.push(element);
		this.playedElements.push(false);
	}

	addFirst(element) {
		this.queue.unshift(element);
		this.playedElements.unshift(false);
	}

	remove(track) {
		this.queue.splice(this.queue.indexOf(track), 1);
		this.playedElements.splice(this.playedElements.indexOf(track), 1);
	}

	get(index) {
		return this.queue[index];
	}

	getLength() {
		return this.queue.length;
	}

	allPlayed() {
		return (
			this.playedElements.every((element) => element === true) ||
			this.queue.length === 0 ||
			(this.currentTrack === this.queue.length - 1 && !this.shuffle)
		);
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
			return this.queue[index].stream();
		} else {
			this.currentTrack = (this.currentTrack + 1) % this.queue.length;
			return this.queue[this.currentTrack].stream();
		}
	}

	shuffle() {
		this.shuffled = true;
	}

	unshuffle() {
		this.shuffled = false;
	}

	loop() {
		if (this.className === 'QueueObject')
			throw new Error('QueueObjects cannot be looped');
	}

	unloop() {
		if (this.className === 'QueueObject')
			throw new Error('QueueObjects cannot be looped');
	}
}
