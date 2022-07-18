import util from '#util/Utilities';
import errorMessage from '#errormessage';

const execute = (interaction, page) => {
	try {
		interaction.update(util.buildList('quotes', page, interaction));
	} catch (error) {
		errorMessage(interaction, error);
	}
};
export { execute };
