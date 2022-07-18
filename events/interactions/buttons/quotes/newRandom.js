import util from '#util/Utilities';
import errorMessage from '#errormessage';

const execute = async (interaction) => {
	try {
		interaction.update(await util.buildRandom('quotes', interaction));
	} catch (error) {
		errorMessage(interaction, error);
	}
};

export { execute };
