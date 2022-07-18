import util from '#util/Utilities';
import errorMessage from '#errormessage';

const execute = (interaction) => {
	try {
		interaction.update(util.buildList('memes', -1, interaction));
	} catch (error) {
		errorMessage(interaction, error);
	}
};
export { execute };
