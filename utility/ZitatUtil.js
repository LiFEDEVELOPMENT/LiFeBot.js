const sql = require('../db/sql.js');

module.exports = {
	async addZitat(guildid, zitat, time, author) {
		// Prepares a SQL statement and inserts the given quote into the zitate table of the db
		let preparedSQL =
			'INSERT INTO zitate (guildid,zitat,time,author) VALUES (?,?,?,?)';
		await sql.run(preparedSQL, [guildid, zitat, time.toString(), author]);

		// Fetches the last (just generated) object of the zitate table and retrieves its id.
		let zitate = await sql.query('SELECT * FROM zitate');
		return zitate[zitate.length - 1].id;
	},
	async deleteZitat(id, guildid) {
		if (id < 0) return false;

		// Fetch all quotes with a matching guildid and check if the given id matches one
		matchedZitat = await this.listZitate(guildid);
		if (matchedZitat.filter((zitat) => zitat.id == id).length < 1) return false;

		await sql.run('DELETE FROM zitate WHERE id=?', id);
		return true;
	},
	async listZitate(guildid) {
		let zitate = await sql.query('SELECT * FROM zitate');
		return zitate.filter((zitat) => zitat.guildid == guildid);
	},
	async charLimitList(guildid) {
		let zitate = await this.listZitate(guildid);
		let resultArray = [];
		let result = '';
		zitate.forEach((element) => {
			if ((result + element.zitat).length > 2000) {
				resultArray.push(result);
				result = '';
			}
			result += '\n\n' + element.zitat + ` **(${element.id})**`;
		});
		if (result != '') resultArray.push(result);
		return resultArray;
	},
	async randomZitat(guildid) {
		// Retrieves a list of all quotes of the given guild and picks a random one
		let guildZitate = await this.listZitate(guildid);
		let random = Math.floor(Math.random() * guildZitate.length);
		return guildZitate[random];
	},
};
