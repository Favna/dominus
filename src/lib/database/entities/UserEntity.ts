import { BaseEntity, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { InfractionEntity } from "./InfractionEntity.js";

@Entity("user")
export class UserEntity extends BaseEntity {
	@PrimaryColumn({ type: "varchar", name: "id", length: 19 })
	public id!: string;

	@OneToMany(() => InfractionEntity, infraction => infraction.user)
	infractions!: InfractionEntity[];
}
