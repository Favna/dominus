import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { PREFIX } from "../../../config.js";
import { InfractionEntity } from "./InfractionEntity.js";

@Entity("guild")
export class GuildEntity extends BaseEntity {
	@PrimaryColumn({ type: "varchar", name: "id", length: 19 })
	public id!: string;

	@Column({ type: "varchar", name: "prefix", length: 5, default: () => PREFIX })
	public prefix = PREFIX;

	@Column({ type: "varchar", name: "moderator", default: "Moderator" })
	public moderator = "Moderator";

	@Column({ type: "varchar", name: "administrator", default: "Administrator" })
	public administrator = "Administrator";

	@OneToMany(() => InfractionEntity, infraction => infraction.guild)
	infractions!: InfractionEntity[];
}

export enum ConfigurableGuildKeys {
	Prefix = "prefix",
	Moderator = "moderator",
	Administrator = "administrator"
}

export enum NonConfigurableGuildKeys {
	ID = "id",
	Infractions = "infractions"
}
