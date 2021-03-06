import { CommandErrorPayload, Event, Events, PieceContext, UserError } from "@sapphire/framework";

export default class extends Event<Events.CommandError> {
	public constructor(context: PieceContext) {
		super(context, { event: Events.CommandError });
	}

	public run(error: Error, { message }: CommandErrorPayload) {
		if (typeof error === "string") return message.channel.send(error);
		if (error instanceof UserError) return message.channel.send(error.message);
		message.channel.send(error.message);
		return console.log(error);
	}
}
