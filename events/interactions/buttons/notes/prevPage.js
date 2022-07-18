import util from '#util/Utilities';
import errorMessage from '#errormessage';

const execute = (interaction, page, query) => {
	try {
		interaction.update(util.buildList('notes', page, interaction, query));
	} catch (error) {
		errorMessage(interaction, error);
	}
};
export { execute };
