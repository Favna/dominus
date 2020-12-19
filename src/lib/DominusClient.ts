import { SapphireClient } from "@sapphire/framework";
import type { ClientOptions } from "discord.js";
import type { Connection } from "typeorm";
import { DatabaseSet } from "./database/structures/DatabaseSet.js";

export class DominusClient extends SapphireClient {
	public connection!: Connection;

	public set!: DatabaseSet;

	public constructor(options?: ClientOptions) {
		super(options);

		this.fetchPrefix = async message =>
			message.guild ? this.set.guilds.getPrefix(message.guild.id) ?? (await this.set.guilds.ensure(message.guild.id)).prefix : "";

		for (const store of this.stores.values()) Reflect.set(store, "preloadHook", (path: string) => import(`file://${path}?d=${Date.now()}`));
	}

	public async destroy() {
		await this.connection.close();
		return super.destroy();
	}

	public async login(token?: string): Promise<string> {
		this.set = await DatabaseSet.connect();
		console.log("Successfully connected to the database.");
		return super.login(token);
	}
}
