import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions, Events } from "@sapphire/framework";
import type { Message } from "discord.js";

@ApplyOptions<CommandOptions>({ name: "setPrefix", aliases: ["prefix"], preconditions: ["GuildOnly", ["Moderator", "Administrator", "OwnerOnly"]] })
export default class extends Command {
	public async run(message: Message, args: Args) {
		const prefix = await args.pick("string").catch(() => null);

		if (!prefix) return this.client.emit(Events.MentionPrefixOnly, message);

		const settings = await this.client.set.guilds.ensure(message.guild!.id);
		settings.prefix = prefix;
		await settings.save();

		return message.channel.send(`Prefix has been set to: \`${prefix}\``);
	}
}
