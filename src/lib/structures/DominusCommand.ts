import { Command, CommandOptions } from "@sapphire/framework";
import type { PieceContext } from "@sapphire/pieces";
import { sep } from "path";

export abstract class DominusCommand extends Command {
	public constructor(context: PieceContext, { name, ...options }: CommandOptions) {
		super(context, { name, ...options });
		this.usage = options.usage ?? this.name;
		this.conditions = options.conditions ?? "This command can be used by anyone.";
		this.category = options.category ?? this.path.split(sep).reverse()[1] ?? "General";
	}
}
