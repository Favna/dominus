import { Args, BucketType, Events } from "@sapphire/framework";
import type { PieceContext } from "@sapphire/pieces";
import type { Message } from "discord.js";
import { ConfigurableGuildKeys } from "../../lib/database/entities/GuildEntity.js";
import { DominusCommand } from "../../lib/structures/DominusCommand.js";

export default class extends DominusCommand {
	public constructor(context: PieceContext) {
		super(context, {
			name: "setPrefix",
			aliases: ["prefix"],
			description: "Set your guild's prefix.",
			detailedDescription: [
				"This command allows you to set your guild's prefix configuration. By providing a valid prefix which is longer than 5 characters it will set, but if none was provided you will get the current configuration.",
				"This command can be ran in a guild by a user with the pre-set **Administrator** or **Moderator** role, and by default the guild owner."
			].join("\n"),
			preconditions: ["GuildOnly", ["OwnerOnly", "AdministratorOnly"], { entry: "Cooldown", context: { bucketType: BucketType.Guild, delay: 1500 } }]
		});
	}

	public get usage() {
		return `${this.name} <prefix>`;
	}

	public async run(message: Message, args: Args) {
		const newPrefix = await args.pick("string").catch(() => null);

		if (!newPrefix) return this.client.emit(Events.MentionPrefixOnly, message);
		if (newPrefix.length > 5) throw "Prefix length cannot be longer than 5 characters.";

		const settings = await this.client.set.guilds.ensure(message.guild!.id);
		const previousPrefix = settings[ConfigurableGuildKeys.Prefix];
		settings[ConfigurableGuildKeys.Prefix] = newPrefix;
		await settings.save();

		return message.channel.send(`This guild's prefix configuration has been changed to \`${newPrefix}\`, from \`${previousPrefix}\``);
	}
}
