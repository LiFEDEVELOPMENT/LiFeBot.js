const sqlite3 = require('sqlite3').verbose();
let db;

module.exports = {
	async openConnection() {
		db = new sqlite3.Database(
			'./db/LiFeDB.db',
			sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
			(err) => {
				if (err) {
					console.error(err.message);
				}
				console.log('Connected to the LiFe-database.');
			}
		);
	},
	async query(sql) {
		db.serialize(() => {
			db.all(sql, (err, row) => {
				if (err) {
					throw err;
				}
				return row;
			});
		});
	},
	async execute(sql) {
		db.serialize(() => {
			db.run(sql);
		});
	},
	async close() {
		db.each((err) => {
			if (err) {
				console.error(err.message);
			}
			console.log('Close the database connection.');
		});
	},
	async test() {
		return 'lol';
	},
};
