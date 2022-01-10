require('dotenv').config();
const sql = require('@sql');
const languageConfig = require('@langs/config.json');

module.exports = {
	async getString(key, mapObject = {}, guildid) {
		let activeLanguages = languageConfig.activeLanguages;
		let lang =
			guildid != undefined
				? await sql.query(
						'SELECT * FROM config WHERE guildid=? AND key=guildlanguage',
						guildid
				  )
				: process.env.DEFAULTLANGUAGE;
		lang = activeLanguages.some((e) => e == lang)
			? lang
			: process.env.DEFAULTLANGUAGE;
		let matchedString;

		dictionary = require(`@langs/${lang}.json`);

		if (dictionary[key] == undefined)
			return await this.getString('MISSING_STRING');
		else matchedString = dictionary[key];

		var regEx = new RegExp(Object.keys(mapObject).join('|'), 'gi');
		if (Object.keys(mapObject).length != 0)
			matchedString = matchedString.replace(regEx, function (matched) {
				return mapObject[matched];
			});
		return matchedString;
	},
};
