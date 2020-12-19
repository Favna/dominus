import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { PREFIX } from "../../../config.js";
import { InfractionEntity } from "./InfractionEntity.js";

@Entity("guild")
export class GuildEntity extends BaseEntity {
	@PrimaryColumn({ type: "varchar", name: "id", length: 19 })
	public id!: string;

	@Column({ type: "varchar", name: "prefix", length: 5 })
	public prefix = PREFIX;

	@Column({ type: "integer", name: "infractionsTotal", default: 0 })
	public infractionsTotal = 0;

	@Column({ type: "varchar", name: "roles.moderator", default: "Moderator" })
	public rolesModerator = "Moderator";

	@Column({ type: "varchar", name: "roles.administrator", default: "Administrator" })
	public rolesAdministrator = "Administrator";

	@Column({ type: "varchar", name: "channels.moderation", default: "moderation-logs" })
	public channelsModeration = "moderation-logs";

	@OneToMany(() => InfractionEntity, infraction => infraction.guild)
	infractions!: InfractionEntity[];

	public async increaseInfractionsTotal() {
		this.infractionsTotal += 1;
		await this.save();
		return this.infractionsTotal;
	}
}

export enum ConfigurableGuildKeys {
	Prefix = "prefix",
	ModeratorRole = "rolesModerator",
	AdministratorRole = "rolesAdministrator",
	ModerationChannel = "channelsModeration"
}

export enum NonConfigurableGuildKeys {
	ID = "id",
	Infractions = "infractions"
}
