import { BucketType } from "@sapphire/framework";
import type { PieceContext } from "@sapphire/pieces";
import type { Message } from "discord.js";
import { DominusCommand } from "../../lib/structures/DominusCommand.js";

export default class extends DominusCommand {
	public constructor(context: PieceContext) {
		super(context, {
			name: "ping",
			description: "Ping? Pong!",
			detailedDescription: [
				"This command provides a test connection to the Discord API with feedback latency.",
				"This command can be ran by everyone."
			].join("\n"),
			preconditions: [{ entry: "Cooldown", context: { bucketType: BucketType.Channel, delay: 1500 } }]
		});
	}

	public async run(message: Message) {
		const msg = await message.channel.send("Ping?");
		return msg.edit(`Pong! Bot Latency ${Math.round(this.client.ws.ping)}ms. API Latency ${msg.createdTimestamp - message.createdTimestamp}ms.`);
	}
}
