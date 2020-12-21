import type { Piece, Store } from "@sapphire/pieces";
import type { DatabaseSet } from "../database/structures/DatabaseSet.js";

declare module "discord.js" {
	interface Client {
		set: DatabaseSet;
		stores: Set<Store<Piece>>;
	}
}

declare module "@sapphire/framework" {
	interface ArgType {
		duration: number;
	}

	interface Command {
		usage: string;
		conditions: string;
		category: string;
	}

	interface CommandOptions {
		usage?: string;
		conditions?: string;
		category?: string;
	}
}
