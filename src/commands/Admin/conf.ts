import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { ConfigurableGuildKeys, GuildEntity, NonConfigurableGuildKeys } from "../../lib/database/entities/GuildEntity.js";

ApplyOptions<CommandOptions>({ name: "conf", preconditions: ["GuildOnly", ["Administrator", "OwnerOnly"]] });

export default class extends Command {
	public async run(message: Message, args: Args) {
		const action = (await args.pick("string").catch(() => null)) as ConfActions | null;

		if (!action) throw "You must provide an action.";
		if (!Object.values(ConfActions).includes(action)) throw "That is not a configurable action.";

		const guild = await this.client.set.guilds.ensure(message.guild!.id);

		if (action === "show") return this.show(message, guild);
		if (action === "reset") return this.reset(message, guild);

		const key = (await args.pick("string").catch(() => null)) as (NonConfigurableGuildKeys & ConfigurableGuildKeys) | null;

		if (!key) throw "You must provide a key.";
		if (Object.values(NonConfigurableGuildKeys).includes(key)) throw "That is a non configurable guild key.";
		if (!Object.values(ConfigurableGuildKeys).includes(key)) throw "You must provide a configurable guild key.";

		const value = await args.pick("string").catch(() => null);

		if (!value) throw "You must provide a value.";

		return this.set(message, guild, key, value);
	}

	private async show(message: Message, guild: GuildEntity) {
		return message.channel.send(
			new MessageEmbed()
				.setTitle("❯ Guild Configuration")
				.setDescription(Object.entries(ConfigurableGuildKeys).map(([name, key]) => `\`${name}\` → ${guild[key]}`))
				.setColor(message.member!.displayHexColor)
		);
	}

	private async reset(message: Message, guild: GuildEntity) {
		await guild.remove();
		return message.channel.send("Successfully reset to default settings.");
	}

	private async set(message: Message, guild: GuildEntity, key: ConfigurableGuildKeys, value: string) {
		guild[key] = value;
		await guild.save();
		return message.channel.send(`Configurable guild key, \`${key}\` has been set to: ${value}`);
	}
}

enum ConfActions {
	Show = "show",
	Reset = "reset",
	Set = "set"
}
