import { Event, EventErrorPayload, Events, PieceContext } from "@sapphire/framework";

export default class extends Event<Events.EventError> {
	public constructor(context: PieceContext) {
		super(context, { event: Events.EventError });
	}

	public run(error: Error, payload: EventErrorPayload) {
		console.log(error, payload);
	}
}
