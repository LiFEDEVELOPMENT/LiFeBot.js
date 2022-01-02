module.exports = {
	async formatDate(date) {
		let preFormattedDate = date.toISOString().split('T')[0];
		return (
			preFormattedDate.substring(8) +
			'.' +
			preFormattedDate.substring(5, 7) +
			'.' +
			preFormattedDate.substring(0, 4)
		);
	},
};
