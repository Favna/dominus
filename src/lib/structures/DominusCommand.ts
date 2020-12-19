import { Command, CommandOptions } from "@sapphire/framework";
import type { PieceContext } from "@sapphire/pieces";
import { sep } from "path";

export abstract class DominusCommand extends Command {
	public constructor(context: PieceContext, { name, ...options }: CommandOptions) {
		super(context, { name, ...options });
	}

	public get category() {
		return this.path.split(sep).reverse()[1] ?? "General";
	}

	public get usage() {
		return this.name;
	}
}
