import {} from 'dotenv/config';
import sql from '#sql';
import config from '#langs/config';

export default async function getString(key, mapObject = {}, guildid) {
	let activeLanguages = config.activeLanguages;
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

	const dictionary = await import(`#langs/${lang}`);

	console.log(dictionary[key]);

	if (dictionary[key] == undefined) return await getString('MISSING_STRING');
	else matchedString = dictionary[key];

	var regEx = new RegExp(Object.keys(mapObject).join('|'), 'gi');
	if (Object.keys(mapObject).length != 0)
		matchedString = matchedString.replace(regEx, function (matched) {
			return mapObject[matched];
		});
	return matchedString;
}
