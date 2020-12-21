import { Precondition } from "@sapphire/framework";
import type { Message } from "discord.js";
import { OWNERS } from "../config";

export class OwnerOnly extends Precondition {
	public async run(message: Message) {
		if (!OWNERS.includes(message.author.id)) return this.error(this.name, "You are not the owner of me.");

		return this.ok();
	}
}
