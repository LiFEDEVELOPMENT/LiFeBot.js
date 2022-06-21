async function execute(event) {
	console.log(event);
}

const once = false;
const name = 'voiceStateUpdate';

export { name, once, execute };
