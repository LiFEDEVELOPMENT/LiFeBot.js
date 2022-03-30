import config from '#langs/config';

export default async function getString(key, mapObject = {}, locale) {
	// guildid provided ? (check if guild-language is active ? use it : ) : use default language
	let matchedString;
	const activeLanguages = config.activeLanguages;
	const defaultLanguage = config.defaultLanguage;
	let language = activeLanguages.some((e) => e === locale)
		? locale
		: defaultLanguage;
	const languageDictionary = (await import(`#langs/${language}`)).default;

	// Check if the dictionary of the current locale has an entry for the key
	// Yes -> Save the string corresponding to the key in the matchedString variable
	// No -> Check if the current locale is the bot's default language
	//.		Yes -> Return the string mapped to MISSING_STRING in the default language
	//.		No -> Check for the string with the bot's default language as the locale
	if (languageDictionary[key] === undefined)
		if (language == defaultLanguage) return await getString('MISSING_STRING');
		else return await getString(key, mapObject, defaultLanguage);
	else matchedString = languageDictionary[key];

	// Replace placeholders in fetched string with values defined in mapObject
	var regEx = new RegExp(Object.keys(mapObject).join('|'), 'gi');
	if (Object.keys(mapObject).length != 0)
		matchedString = matchedString.replace(regEx, function (matched) {
			return mapObject[matched];
		});
	return matchedString;
}
