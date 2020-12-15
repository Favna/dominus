import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GuildEntity } from "./GuildEntity.js";

@Entity("infraction")
export class InfractionEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id!: number;

	@ManyToOne(() => GuildEntity, guild => guild.infractions)
	guild!: GuildEntity;
}
