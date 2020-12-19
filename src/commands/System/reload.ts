import type { Args } from "@sapphire/framework";
import type { PieceContext } from "@sapphire/pieces";
import { DominusCommand } from "../../lib/structures/DominusCommand.js";
import type { Message } from "discord.js";

export default class extends DominusCommand {
	public constructor(context: PieceContext) {
		super(context, {
			name: "reload",
			description: "Reload pieces.",
			detailedDescription: [
				"This command will reload all pieces if no piece name is provided. This includes `commands`, `arguments` and `preconditions`.",
				"This command can only be ran by my owner."
			].join("\n"),
			preconditions: ["OwnerOnly"]
		});
	}

	public get usage() {
		return `${this.name} [piece]`;
	}

	public async run(message: Message, args: Args) {
		const action = (await args.pick("string").catch(() => null)) as ReloadActions | null;

		switch (action) {
			case ReloadActions.Commands:
				return this.reloadCommands(message);
			case ReloadActions.Arguments:
				return this.reloadArguments(message);
			case ReloadActions.Preconditions:
				return this.reloadPreconditions(message);
			case ReloadActions.All:
				return this.reloadAll(message);
			default:
				return this.reloadAll(message);
		}
	}

	public async reloadCommands(message: Message) {
		this.client.commands.clear();
		await this.client.commands.loadAll();

		return message.channel.send("Command pieces reloaded.");
	}

	public async reloadArguments(message: Message) {
		this.client.arguments.clear();
		await this.client.arguments.loadAll();

		return message.channel.send("Argument pieces reloaded.");
	}

	public async reloadPreconditions(message: Message) {
		this.client.preconditions.clear();
		await this.client.preconditions.loadAll();

		return message.channel.send("Precondition pieces reloaded.");
	}

	public async reloadAll(message: Message) {
		for (const store of this.client.stores.values()) {
			store.clear();
			await store.loadAll();
		}
		return message.channel.send("All pieces reloaded.");
	}
}

enum ReloadActions {
	Commands = "commands",
	Arguments = "arguments",
	Preconditions = "preconditions",
	All = "all"
}
