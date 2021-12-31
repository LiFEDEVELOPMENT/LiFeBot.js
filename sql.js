const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');
let db;

module.exports = {
	async openConnection() {
		db = await sqlite.open({
			filename: './db/LiFeDB.db',
			driver: sqlite3.Database,
		});
	},
	async query(sql) {
		return await db.all(sql);
	},
	async execute(sql) {
		db.exec(sql);
	},
	async close() {
		db.each((err) => {
			if (err) {
				console.error(err.message);
			}
			console.log('Close the database connection.');
		});
	},
};
