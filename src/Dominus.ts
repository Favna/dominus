import { TOKENS } from "./config.js";
import { DominusClient } from "./lib/DominusClient.js";

const client = new DominusClient();

try {
	await client.login(TOKENS.BOT_TOKEN);
} catch (error) {
	console.log(error);
	client.destroy();
	process.exit(1);
}
