import { Argument } from "@sapphire/framework";
import type { PieceContext } from "@sapphire/pieces";
import type { User } from "discord.js";

export default class extends Argument<User> {
	private userIDRegex = /^(?:<@!?)?(\d{17,19})>?$/;

	public constructor(context: PieceContext) {
		super(context, { name: "user" });
	}

	public async run(argument: string) {
		if (!argument) return this.error(this.name, "User not provided.");

		const id = this.userIDRegex.exec(argument);
		const user = id ? await this.client.users.fetch(id![1]).catch(() => null) : null;

		if (!user) return this.error(this.name, "User not found.");

		return this.ok(user);
	}
}
