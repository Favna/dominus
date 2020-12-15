import { EntityRepository, FindOneOptions, Repository } from "typeorm";
import { GuildEntity } from "../entities/GuildEntity.js";

@EntityRepository(GuildEntity)
export class GuildRepository extends Repository<GuildEntity> {
	public async ensure(id: string, options?: FindOneOptions<GuildEntity>) {
		const fromRepository = await this.findOne(id, options);
		if (fromRepository) return fromRepository;

		const guild = new GuildEntity();
		guild.id = id;
		return guild.save();
	}
}
