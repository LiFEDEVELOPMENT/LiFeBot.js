import config from '#langs/config';

let dictionaries = {};

for (let language of config.activeLanguages) {
	let dictionary = await import(`#langs/${language}`);
	dictionaries[language] = dictionary.default;
}

export default (key, lang, textReplacements = {}) => {
	if (!dictionaries[lang]) return `${lang}/${key}`;

	let string = dictionaries[lang][key];

	// Replace parameters in text
	let regEx = new RegExp(Object.keys(textReplacements).join('|'), 'gi');
	if (Object.keys(textReplacements).length != 0)
		string = string.replace(regEx, (match) => {
			return textReplacements[match];
		});

	return string;
};
