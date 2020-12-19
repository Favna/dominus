import { Argument, ArgumentContext, Result, UserError } from "@sapphire/framework";
import type { PieceContext } from "@sapphire/pieces";

export default class extends Argument<string> {
	public constructor(context: PieceContext) {
		super(context, { name: "string" });
	}

	public async run(argument: string, context: ArgumentContext): Promise<Result<string, UserError>> {
		if (typeof context.minimum === "number" && argument.length < context.minimum) return this.error(this.name, "Argument string was too short.");

		if (typeof context.maximum === "number" && argument.length > context.maximum) return this.error(this.name, "Argument string was too long.");

		return this.ok(argument);
	}
}
