import { Precondition } from "@sapphire/framework";
import type { Message } from "discord.js";
import { ConfigurableGuildKeys } from "../lib/database/entities/GuildEntity.js";

export class ModeratorOnly extends Precondition {
	public async run(message: Message) {
		if (!message.guild) return this.error(this.name, "Guild not found.");
		if (message.author.id === message.guild.ownerID) return this.ok();

		const guild = await this.client.set.guilds.ensure(message.guild.id);
		const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === guild[ConfigurableGuildKeys.ModeratorRole].toLowerCase());

		if (!role) return this.error(this.name, "This guild's Moderator role has not been setup.");
		if (!message.member!.roles.cache.some(r => r.id === role.id))
			return this.error(this.name, "You do not have this guild's pre-set **Moderator** role.");

		return this.ok();
	}
}
