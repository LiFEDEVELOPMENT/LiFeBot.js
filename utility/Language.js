import {} from 'dotenv/config';
import sql from '#sql';
import config from '#langs/config';

export default async function getString(key, mapObject = {}, guildid) {
	// guildid provided ? (check if guild-language is active ? use it : ) : use default language
	let activeLanguages = config.activeLanguages;
	let language =
		guildid != undefined
			? await sql.query(
					'SELECT * FROM config WHERE guildid=? AND key=guildlanguage',
					guildid
			  )
			: process.env.DEFAULTLANGUAGE;
	language = activeLanguages.some((e) => e == language)
		? language
		: process.env.DEFAULTLANGUAGE;

	let matchedString;

	// Fetch string for selected language and check if it's available. If not -> Fetch string in default language.
	// If not -> Return "MISSING_STRING"
	const dictionary = (await import(`#langs/${language}`)).default;
	if (dictionary[key] == undefined)
		if (language == process.env.DEFAULTLANGUAGE)
			return await getString('MISSING_STRING');
		else return await getString(process.env.DEFAULTLANGUAGE);
	else matchedString = dictionary[key];

	// Replace placeholders in fetched string with values defined in mapObject
	var regEx = new RegExp(Object.keys(mapObject).join('|'), 'gi');
	if (Object.keys(mapObject).length != 0)
		matchedString = matchedString.replace(regEx, function (matched) {
			return mapObject[matched];
		});
	return matchedString;
}
