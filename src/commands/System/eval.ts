import type { Args } from "@sapphire/framework";
import type { PieceContext } from "@sapphire/pieces";
import { Message, Permissions } from "discord.js";
import { codeBlock } from "@sapphire/utilities";
import { Type } from "@sapphire/type";
import { inspect } from "util";
import { DominusCommand } from "../../lib/structures/DominusCommand.js";

export default class extends DominusCommand {
	public constructor(context: PieceContext) {
		super(context, {
			name: "eval",
			aliases: ["ev"],
			description: "Eval js code.",
			detailedDescription: [
				"This command will evaluate Javascript code. To activate asynchronous capabilities use flag `async`.",
				"This command can only be ran by my owner."
			].join("\n"),
			preconditions: ["OwnerOnly", { entry: "Permissions", context: { permissions: [Permissions.ALL] } }],
			strategyOptions: { flags: ["async", "json"], options: ["language", "lang", "depth"] },
			quotes: []
		});
	}

	public get usage() {
		return `${this.name} <...code>`;
	}

	public async run(message: Message, args: Args) {
		const code = await args.rest("string").catch(() => null);
		if (!code) throw "No code to eval!";
		const language = args.getOption("language") ?? args.getOption("lang") ?? args.getFlags("json") ? "json" : "js";
		const { success, type, time, result } = await this.eval(message, args, code);

		if (!success) return message.channel.send(`**Ouput:**${codeBlock("", result)}\n**Type:**${codeBlock("ts", type.toString())}`);

		const footer = codeBlock("ts", type.toString());

		return message.channel.send(`**Output:**\n${codeBlock(language, result)}\n**Type:**${footer}\n${time}`);
	}

	private async eval(message: Message, args: Args, code: string) {
		let time = Date.now();
		let success: boolean | undefined = undefined;
		let syncTime: string | undefined = undefined;
		let asyncTime: string | undefined = undefined;
		let result: unknown | undefined = undefined;
		let type: Type | undefined = undefined;
		try {
			if (args.getFlags("async")) code = `(async () => {\n${code}\n})();`;

			// @ts-expect-error 6133
			const msg = message;

			result = eval(code);
			syncTime = (Date.now() - time).toString();
			if (args.getFlags("async")) {
				time = Date.now();
				result = await result;
				asyncTime = (Date.now() - time).toString();
			}
			type = new Type(result);
			success = true;
		} catch (error) {
			if (!syncTime) syncTime = (Date.now() - time).toString();
			if (args.getFlags("async") && !asyncTime) asyncTime = (Date.now() - time).toString();
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
		return { success, type, time: this.formatTime(syncTime, asyncTime ?? ""), result };
	}

	private formatTime(syncTime: string, asyncTime: string) {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>ms` : `⏱ ${syncTime}ms`;
	}
}
