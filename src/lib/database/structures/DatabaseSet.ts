import { Connection, createConnection, getCustomRepository, getRepository, Repository } from "typeorm";
import { PGSQL_DATABASE_OPTIONS } from "../../../config.js";
import { InfractionEntity } from "../entities/InfractionEntity.js";
import { GuildRepository } from "../repositories/GuildRepository.js";
import { UserRepository } from "../repositories/UserRepository.js";

export class DatabaseSet {
	public readonly connection: Connection;
	public readonly guilds: GuildRepository;
	public readonly users: UserRepository;
	public readonly infractions: Repository<InfractionEntity>;

	private constructor(connection: Connection) {
		this.connection = connection;
		this.guilds = getCustomRepository(GuildRepository);
		this.users = getCustomRepository(UserRepository);
		this.infractions = getRepository(InfractionEntity);
	}

	public static async connect() {
		const connection = await createConnection(PGSQL_DATABASE_OPTIONS);
		return new DatabaseSet(connection);
	}
}
