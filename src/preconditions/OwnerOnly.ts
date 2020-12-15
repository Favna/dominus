import { err, ok, Precondition, UserError } from "@sapphire/framework";
import type { Message } from "discord.js";
import { OWNERS } from "../config.js";

export class OwnerOnly extends Precondition {
	public async run(message: Message) {
		if (!OWNERS.includes(message.author.id)) return err(new UserError("OwnerOnly", "This command can only be used by the owner."));
		return ok();
	}
}
