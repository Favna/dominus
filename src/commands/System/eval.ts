import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import type { Message } from "discord.js";
import { codeBlock } from "@sapphire/utilities";
import { wait } from "../../lib/utils/wait.js";
import { Type } from "@sapphire/type";
import { inspect } from "util";

@ApplyOptions<CommandOptions>({
	name: "eval",
	aliases: ["ev"],
	preconditions: ["OwnerOnly"],
	strategyOptions: { flags: ["async", "no-timeout", "json", "showHidden"], options: ["language", "lang", "depth"] },
	quotes: []
})
export default class extends Command {
	public async run(message: Message, args: Args) {
		const code = await args.rest("string").catch(() => null);
		if (!code) throw "No code to eval!";
		const flagTime = args.getFlags("no-timeout") ? Number(args.getOption("wait")) ?? 60000 : Infinity;
		const language = args.getOption("language") ?? args.getOption("lang") ?? args.getFlags("json") ? "json" : "js";
		const { success, result, type } = await this.timedEval(message, args, code, flagTime);

		if (!success) return message.channel.send(`**Ouput:**${codeBlock("", result)}\n**Type:**${codeBlock("ts", type.toString())}`);

		const footer = codeBlock("ts", type.toString());

		return message.channel.send(`**Output:**\n${codeBlock(language, result)}\n**Type:**${footer}`);
	}

	private async timedEval(message: Message, args: Args, code: string, flagTime: number) {
		if (flagTime === Infinity || flagTime === 0) return this.eval(message, args, code);
		return Promise.race([
			wait(flagTime).then(() => ({
				result: flagTime / 1000,
				success: false,
				time: "⏱ ...",
				type: "EvalTimeoutError"
			})),
			this.eval(message, args, code)
		]);
	}

	private async eval(message: Message, args: Args, code: string) {
		let success: boolean | undefined = undefined;
		let result: unknown | undefined = undefined;
		let type: Type | undefined = undefined;
		try {
			if (args.getFlags("async")) code = `(async () => {\n${code}\n})();`;

			// @ts-expect-error 6133
			const msg = message;

			result = eval(code);
			if (args.getFlags("async")) result = await result;
			type = new Type(result);
			success = true;
		} catch (error) {
			if (!type!) type = new Type(error);
			result = error;
			success = false;
		}

		if (typeof result !== "string") {
			result =
				result instanceof Error
					? result.stack
					: args.getFlags("json")
					? JSON.stringify(result, null, 2)
					: inspect(result, {
							depth: args.getOption("depth") ? parseInt(args.getOption("depth") ?? "", 10) || 0 : 0,
							showHidden: args.getFlags("showHidden")
					  });
		}
		return { success, type, result };
	}
}
