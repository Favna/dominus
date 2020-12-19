import { Args, BucketType } from "@sapphire/framework";
import type { PieceContext } from "@sapphire/pieces";
import { DominusCommand } from "../../lib/structures/DominusCommand.js";
import { Message, TextChannel, MessageEmbed, Permissions } from "discord.js";
import { InfractionActions, InfractionEntity } from "../../lib/database/entities/InfractionEntity.js";
import { ConfigurableGuildKeys } from "../../lib/database/entities/GuildEntity.js";
import { CLIENT_ID, OWNERS } from "../../config.js";

export default class extends DominusCommand {
	public constructor(context: PieceContext) {
		super(context, {
			name: "kick",
			description: "Kick a user.",
			detailedDescription: [
				"Kick a user in a guild. By providing a mention or id, you can kick the user. A reason is optional, but preferred.",
				"This command can only be ran in a guild by a member with the pre-set **Administrator** or **Moderator** role, and of course by default the guild owner."
			].join("\n"),
			preconditions: [
				"GuildOnly",
				["OwnerOnly", "AdministratorOnly", "ModeratorOnly"],
				{ entry: "Cooldown", context: { bucketType: BucketType.User, delay: 2000 } },
				{ entry: "Permissions", context: { permissions: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.KICK_MEMBERS] } }
			]
		});
	}

	public get usage() {
		return `${this.name} <user> [...reason]`;
	}

	public async run(message: Message, args: Args) {
		const user = await args.pick("user").catch(() => null);

		if (!user) throw "User not provided.";
		if ([CLIENT_ID, message.author.id].includes(user.id) || OWNERS.includes(user.id)) throw "Unable to use moderation actions on this user.";

		const member = await message.guild!.members.fetch(user.id);

		if (!member) throw "Member not found.";

		const reason = await args.rest("string").catch(() => null);

		if (reason && reason.length > 1000) throw "Reason maximum char length is 1000.";

		const guild = await this.client.set.guilds.ensure(message.guild!.id);
		const infraction = new InfractionEntity();
		infraction.caseID = await guild.increaseInfractionsTotal();
		infraction.guild = guild;
		infraction.user = await this.client.set.users.ensure(user.id);
		infraction.action = InfractionActions.Kick;
		infraction.reason = reason;
		await infraction.save();

		const sent = await user.send(`You have been kicked from **${message.guild!.name}** → ${reason || "No reason was provided."}`).catch(() => null);

		const kicked = await member.kick(reason || "No reason was provided.").catch(() => null);

		if (!kicked) throw "I was unable to kick this member.";

		const channelsModeration = message.guild!.channels.cache.find(
			channel => channel.name.toLowerCase() === guild[ConfigurableGuildKeys.ModerationChannel].toLowerCase() && channel.type === "text"
		) as TextChannel | undefined;

		if (channelsModeration)
			channelsModeration.send(
				new MessageEmbed()
					.setColor("RED")
					.setAuthor(message.author.tag, message.author.displayAvatarURL())
					.setDescription([`**Action:** Kick`, `**User:** ${user.tag}`, `**Reason:** ${reason || "No reason was provided."}`])
					.setFooter(`Infraction Case ${infraction.caseID}`, this.client.user!.displayAvatarURL())
					.setTimestamp()
			);

		return message.channel.send(
			`Created Infraction Case ${infraction.caseID} → \`${user.tag} (${user.id})\` → **DM ${sent ? "Successful" : "Failed"}** → ${
				reason || "No reason was provided."
			}`,
			{ allowedMentions: { users: [] } }
		);
	}
}
