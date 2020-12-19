import type { Args } from "@sapphire/framework";
import type { PieceContext } from "@sapphire/pieces";
import { DominusCommand } from "../../lib/structures/DominusCommand.js";
import { Message, MessageEmbed, Permissions } from "discord.js";
import { toProperCase } from "../../lib/utils/toProperCase.js";

export default class extends DominusCommand {
	public constructor(context: PieceContext) {
		super(context, {
			name: "help",
			description: "Get some help!",
			detailedDescription: [
				"By providing a command name you can view it's information, but by default you will receive a list of commands you could run",
				"This command can be ran by everyone."
			].join("\n"),
			preconditions: [{ entry: "Permissions", context: { permissions: [Permissions.FLAGS.EMBED_LINKS] } }]
		});
	}

	public get usage() {
		return `${this.name} [command]`;
	}

	public async run(message: Message, args: Args) {
		const commandName = await args.pick("string").catch(() => null);

		if (!commandName) return this.menu(message);
		if (!this.client.commands.has(commandName.toLowerCase())) throw "That is not a command.";

		const command = this.client.commands.get(commandName.toLowerCase()) as DominusCommand;

		const prefix = message.guild
			? this.client.set.guilds.getPrefix(message.guild.id) ?? (await this.client.set.guilds.ensure(message.guild.id)).prefix
			: "@Dominus ";

		const embed = new MessageEmbed()
			.setColor(message.member?.displayHexColor ?? "")
			.addField("❯ Usage", `\`${prefix}${command.usage}\``)
			.addField("❯ Detailed Description", command.detailedDescription || "No detailed description was provided.")
			.setTimestamp();

		if (command.description) embed.setDescription(command.description);

		return message.channel.send(embed);
	}

	private async menu(message: Message) {
		const embed = new MessageEmbed().setColor(message.member?.displayHexColor ?? "").setTimestamp();

		const categories = new Set<string>();

		for (const { category } of this.client.commands.array() as DominusCommand[]) categories.add(category);

		for (const cat of categories) {
			embed.addField(
				`❯ ${toProperCase(cat)}`,
				this.client.commands
					.filter(cmd => (cmd as DominusCommand).category.toLowerCase() === cat.toLowerCase())
					.map(cmd => `\`${cmd.name}\` → *${cmd.description || "No description was provided."}*`)
			);
		}

		return message.channel.send(embed);
	}
}
