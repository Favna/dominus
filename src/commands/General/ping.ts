import { ApplyOptions } from "@sapphire/decorators";
import { Command, CommandOptions } from "@sapphire/framework";
import type { Message } from "discord.js";

@ApplyOptions<CommandOptions>({ name: "ping" })
export default class extends Command {
	public async run(message: Message) {
		const msg = await message.channel.send("Ping?");
		return msg.edit(`Ping! Bot Latency ${Math.round(this.client.ws.ping)}ms. API Latency ${msg.createdTimestamp - message.createdTimestamp}ms.`);
	}
}
