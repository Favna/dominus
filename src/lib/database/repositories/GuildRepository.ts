import { EntityRepository, FindOneOptions, Repository } from "typeorm";
import { GuildEntity } from "../entities/GuildEntity.js";

@EntityRepository(GuildEntity)
export class GuildRepository extends Repository<GuildEntity> {
	public prefixes = new Map<string, string>();

	public getPrefix(id: string) {
		return this.prefixes.get(id);
	}

	public async ensure(id: string, options?: FindOneOptions<GuildEntity>) {
		const fromRepository = await this.findOne(id, options);
		if (fromRepository) return fromRepository;

		const guild = new GuildEntity();
		guild.id = id;
		return guild.save();
	}

	public async ensureInfractions(id: string, options: FindOneOptions<GuildEntity>) {
		return this.ensure(id, { ...options, relations: ["infractions"] });
	}
}
