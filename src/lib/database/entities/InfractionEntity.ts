import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GuildEntity } from "./GuildEntity.js";
import { UserEntity } from "./UserEntity.js";

@Entity("infraction")
export class InfractionEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id!: number;

	@Column({ type: "integer", name: "caseID" })
	public caseID!: number;

	@Column({ type: "integer", name: "action", nullable: true })
	public action!: number | null;

	@Column({ type: "timestamp without time zone", name: "createdAt", default: new Date() })
	public createdAt = new Date();

	@Column({ type: "varchar", name: "reason", length: 1000, nullable: true })
	public reason: string | null = null;

	@ManyToOne(() => GuildEntity, guild => guild.infractions)
	guild!: GuildEntity;

	@ManyToOne(() => UserEntity, user => user.infractions, { eager: true })
	user!: UserEntity;

	public get showAction() {
		switch (this.action) {
			case InfractionActions.Warn:
				return "warn";
			case InfractionActions.Kick:
				return "kick";
			case InfractionActions.Ban:
				return "ban";
			default:
				return "unknown";
		}
	}
}

export enum InfractionActions {
	Warn,
	Kick,
	Ban
}
