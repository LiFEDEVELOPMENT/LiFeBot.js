const { Database, sql } = require('@leafac/sqlite');

const db = new Database("LiFeDB.db");
db.execute(sql`CREATE TABLE IF NOT EXISTS memes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, guildid INTEGER, meme STRING);`);