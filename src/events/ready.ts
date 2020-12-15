import { Event, Events, PieceContext } from "@sapphire/framework";

export default class extends Event<Events.Ready> {
	public constructor(context: PieceContext) {
		super(context, { event: Events.Ready, once: true });
	}

	public run() {
		if (!this.client.id) this.client.id = this.client.user?.id ?? null;
		console.log(`${this.client.user!.tag} (${this.client.id}) is ready in ${this.client.guilds.cache.size} guilds.`);
	}
}
