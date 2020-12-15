import { err, ok, Precondition, UserError } from "@sapphire/framework";
import type { Message } from "discord.js";

export class Moderator extends Precondition {
	public async run(message: Message) {
		if (!message.guild) return err(new UserError("GuildNotFound", "Guild was not found."));

		const guild = await this.client.set.guilds.ensure(message.guild.id);
		const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === guild.moderator.toLowerCase());

		if (!role) return err(new UserError("ModeratorNotSetup", "This guild's Moderator role has not been setup."));
		if (!message.member!.roles.cache.some(r => r.id === role.id)) return err(new UserError("Moderator", "Moderator role not found."));

		return ok();
	}
}
