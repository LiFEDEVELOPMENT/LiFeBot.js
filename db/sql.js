const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');
let db;

module.exports = {
	async openConnection() {
		db = await sqlite.open({
			filename: './db/LiFeDB.db',
			driver: sqlite3.Database,
		});
		console.log('Connected to LiFe-database');
	},
	query(sql) {
		return db.all(sql);
	},
	async run(sql, placeholders) {
		await db.run(sql, placeholders);
	},
};
