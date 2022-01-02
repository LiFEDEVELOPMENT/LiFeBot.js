const sql = require('../db/sql.js');

module.exports = {
	async addMeme(guildid, meme) {
		// Prepares a SQL statement and inserts the given quote into the zitate table of the db
		let preparedSQL = 'INSERT INTO memes (guildid,meme) VALUES (?,?)';
		await sql.run(preparedSQL, [guildid, meme]);

		// Fetches the last (just generated) object of the memes table and retrieves its id.
		let memes = await sql.query('SELECT * FROM memes');
		return memes[memes.length - 1].id;
	},
	async deleteMeme(id, guildid) {
		if (id < 0) return false;

		// Fetch all memes with a matching guildid and check if the given id matches one
		matchedMeme = await this.listMemes(guildid);
		if (matchedMeme.filter((meme) => meme.id == id).length < 1) return false;

		await sql.run('DELETE FROM memes WHERE id=?', id);
		return true;
	},
	async listMemes(guildid) {
		let memes = await sql.query('SELECT * FROM memes');
		return memes.filter((meme) => meme.guildid == guildid);
	},
	async charLimitList(guildid) {
		let memes = await this.listMemes(guildid);
		let resultArray = [];
		let result = '';
		memes.forEach((element) => {
			if ((result + element.meme).length > 2000) {
				resultArray.push(result);
				result = '';
			}
			result += '\n\n' + element.meme + ` **(${element.id})**`;
		});
		if (result != '') resultArray.push(result);
		return resultArray;
	},
	async randomMeme(guildid) {
		// Retrieves a list of all memes of the given guild and picks a random one
		let guildMemes = await this.listMemes(guildid);
		let random = Math.floor(Math.random() * guildMemes.length);
		return guildMemes[random];
	},
};