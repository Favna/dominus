import { Args, BucketType } from "@sapphire/framework";
import type { PieceContext } from "@sapphire/pieces";
import { Message, MessageEmbed, Permissions } from "discord.js";
import { ConfigurableGuildKeys, GuildEntity, NonConfigurableGuildKeys } from "../../lib/database/entities/GuildEntity.js";
import { DominusCommand } from "../../lib/structures/DominusCommand.js";

export default class extends DominusCommand {
	public constructor(context: PieceContext) {
		super(context, {
			name: "conf",
			aliases: ["config", "settings"],
			description: "Manage guild configurations.",
			detailedDescription: [
				"This command provides management for a guild's configuration. You need to provide an action to use this command, these are the current actions available: `show`, `keys`, `reset` and `set`. Below lists each action and their own description and usage.",
				"",
				"**Show:** This action will provide and.. well *show* the configuration for the current guild.",
				"**Keys:** This action is useful for those who aren't familiar with all the configurative keys. It will show all keys that are configurable.",
				"**Reset:** This action will simply reset all configurations with a confirmation. Do not try to test this unless you want to reset all your configurations to default.",
				"**Set:** This action will set a configuration key's value. This requires a configurable key and a valid value. If the value is not valid it will throw an error.",
				"This command can be ran in a guild by a user with the pre-set **Administrator** or **Moderator** role, and by default the guild owner."
			].join("\n"),
			preconditions: [
				"GuildOnly",
				["OwnerOnly", "AdministratorOnly"],
				{ entry: "Cooldown", context: { bucketType: BucketType.Guild, delay: 1500 } },
				{ entry: "Permissions", context: { permissions: [Permissions.FLAGS.EMBED_LINKS] } }
			]
		});
	}

	public get usage() {
		return `${this.name} <action> [key] [...value]`;
	}

	public async run(message: Message, args: Args) {
		const action = (await args.pick("string").catch(() => null)) as ConfActions | null;

		if (!action) throw "Action not found.";
		if (!Object.values(ConfActions).includes(action)) throw "Action non-configurable.";

		const guild = await this.client.set.guilds.ensure(message.guild!.id);

		switch (action) {
			case ConfActions.Show:
				return this.show(message, guild);
			case ConfActions.Keys:
				return this.keys(message);
			case ConfActions.Reset:
				return this.reset(message, guild);
			case ConfActions.Set:
				const key = (await args.pick("string").catch(() => null)) as (NonConfigurableGuildKeys & ConfigurableGuildKeys) | null;

				if (!key) throw "Key not found.";
				if (Object.values(NonConfigurableGuildKeys).includes(key) && !Object.values(ConfigurableGuildKeys).includes(key))
					throw "Guild key non-configurable.";

				const value = await args.pick("string").catch(() => null);

				if (!value) throw "Value not found.";

				return this.set(message, guild, key, value);
		}
	}

	private async show(message: Message, guild: GuildEntity) {
		return message.channel.send(
			new MessageEmbed()
				.setTitle("❯ Guild Configuration")
				.setDescription(Object.entries(ConfigurableGuildKeys).map(([name, key]) => `\`${name}\` → ${guild[key]}`))
				.setColor(message.member?.displayHexColor ?? "")
				.setTimestamp()
		);
	}

	private async keys(message: Message) {
		return message.channel.send(
			new MessageEmbed()
				.setTitle("❯ Guild Configurable Keys")
				.setDescription(Object.entries(ConfigurableGuildKeys).map(([name, key]) => `**${name}** → \`${key}\``))
				.setColor(message.member?.displayHexColor ?? "")
				.setTimestamp()
		);
	}

	private async reset(message: Message, guild: GuildEntity) {
		await guild.remove();
		return message.channel.send("Successfully reset to default settings.");
	}

	private async set(message: Message, guild: GuildEntity, key: ConfigurableGuildKeys, value: string) {
		value = await this.resolveValue(message, key, value);
		guild[key] = value;
		await guild.save();
		return message.channel.send(`Configurable guild key, \`${key}\` has been set to: ${value}`);
	}

	private async resolveValue(message: Message, key: ConfigurableGuildKeys, value: string) {
		const roleIDRegex = /^(?:<&)?(\d{17,19})>?$/;
		const channelIDRegex = /^(?:<#)?(\d{17,19})>?$/;

		switch (key) {
			case ConfigurableGuildKeys.Prefix:
				if (value.length > 5) throw "Prefix cannot be longer than 5 characters.";

				return value;
			case ConfigurableGuildKeys.ModeratorRole:
			case ConfigurableGuildKeys.AdministratorRole: {
				const id = roleIDRegex.exec(value);
				const role = id ? message.guild!.roles.cache.get(id![1]) : message.guild!.roles.cache.find(r => r.name.toLowerCase() === value.toLowerCase());

				if (!role) throw "Role not found.";
				if (role.id === message.guild!.id) throw "Role non-configurable.";

				return role.name;
			}
			case ConfigurableGuildKeys.ModerationChannel: {
				const id = channelIDRegex.exec(value);
				const channel = id
					? message.guild!.channels.cache.get(id![1])
					: message.guild!.channels.cache.find(c => c.name.toLowerCase() === value.toLowerCase() && c.type === "text");

				if (!channel) throw "Channel not found.";

				return channel.name;
			}
			default:
				throw "Value non-configurable.";
		}
	}
}

enum ConfActions {
	Show = "show",
	Keys = "keys",
	Reset = "reset",
	Set = "set"
}
