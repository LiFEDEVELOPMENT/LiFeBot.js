import util from '#util/Utilities';
import errorMessage from '#errormessage';

const execute = (interaction, query) => {
	try {
		interaction.update(util.buildList('notes', -1, interaction, query));
	} catch (error) {
		errorMessage(interaction, error);
	}
};
export { execute };
