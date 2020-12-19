import { EntityRepository, FindOneOptions, Repository } from "typeorm";
import { UserEntity } from "../entities/UserEntity.js";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
	public async ensure(id: string, options?: FindOneOptions<UserEntity>) {
		const fromRepository = await this.findOne(id, options);
		if (fromRepository) return fromRepository;

		const user = new UserEntity();
		user.id = id;
		return user.save();
	}

	public async ensureInfractions(id: string, options?: FindOneOptions<UserEntity>) {
		return this.ensure(id, { ...options, relations: ["infractions"] });
	}
}
