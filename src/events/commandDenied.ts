import { CommandDeniedPayload, Event, Events, PieceContext, UserError } from "@sapphire/framework";

export default class extends Event<Events.CommandDenied> {
	public constructor(context: PieceContext) {
		super(context, { event: Events.CommandDenied });
	}

	public run(error: UserError, { message }: CommandDeniedPayload) {
		if (error.identifier === "OwnerOnly") return;
		return message.channel.send(error.message);
	}
}
