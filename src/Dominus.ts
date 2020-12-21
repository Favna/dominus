import { CLIENT_OPTIONS, TOKENS } from "./config";
import { DominusClient } from "./lib/DominusClient.js";

const client = new DominusClient(CLIENT_OPTIONS);

try {
	await client.login(TOKENS.BOT_TOKEN);
} catch (error) {
	console.log(error);
	client.destroy();
	process.exit(1);
}
