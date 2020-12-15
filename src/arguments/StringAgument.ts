import { Argument, ArgumentContext, err, ok, Result, UserError } from "@sapphire/framework";
import type { PieceContext } from "@sapphire/pieces";

export class StringArgument extends Argument {
	public constructor(context: PieceContext) {
		super(context, { name: "string" });
	}

	public async run(argument: string, context: ArgumentContext): Promise<Result<string, UserError>> {
		if (typeof context.minimum === "number" && argument.length < context.minimum)
			return err(new UserError("ArgumentStringTooShort", "Argument string was too short."));

		if (typeof context.maximum === "number" && argument.length > context.maximum)
			return err(new UserError("ArgumentStringTooLong", "Argument string was too long."));

		return ok(argument);
	}
}
