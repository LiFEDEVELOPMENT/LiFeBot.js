import Database from 'better-sqlite3';
const db = new Database('./db/LiFeDB.db');

async function query(sql, placeholders = []) {
	return db.prepare(sql).all(placeholders);
}
async function run(sql, placeholders = []) {
	db.prepare(sql).run(placeholders);
}

export default { query, run };
