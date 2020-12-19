import { Args, BucketType } from "@sapphire/framework";
import type { PieceContext } from "@sapphire/pieces";
import { Message, MessageEmbed, User, Permissions } from "discord.js";
import { DominusCommand } from "../../lib/structures/DominusCommand.js";
import ms from "ms";

export default class extends DominusCommand {
	public constructor(context: PieceContext) {
		super(context, {
			name: "infractions",
			description: "View infractions of a user in a guild.",
			detailedDescription: [
				"This command allows you to view the infractions of a user in the command's currently ran in guild. A user mention or id is optional, by providing a user you can view their infractions, but by default the command's author's infractions are shown.",
				"This command can be ran by everyone in a guild."
			].join("\n"),
			preconditions: [
				"GuildOnly",
				{ entry: "Cooldown", context: { bucketType: BucketType.User, delay: 1500 } },
				{ entry: "Permissions", context: { permissions: [Permissions.FLAGS.EMBED_LINKS] } }
			]
		});
	}

	public get usage() {
		return `${this.name} [user]`;
	}

	public async run(message: Message, args: Args) {
		const user = await args.pick("user").catch(() => message.author);

		const caseID = await args.pick("number").catch(() => null);

		if (caseID) return this.showCase(message, user, caseID);

		const infractions = await this.client.set.infractions.find({ where: { user: { id: user.id }, guild: { id: message.guild!.id } } });

		if (!infractions.length) return message.channel.send("This user has no infractions.");

		return message.channel.send(
			new MessageEmbed()
				.setColor(message.member?.displayHexColor ?? "")
				.setAuthor(`${user.tag} (${user.id})`, user.displayAvatarURL())
				.setDescription(
					`${infractions
						.map(
							infraction =>
								`\`${infraction.caseID}\` → **${infraction.showAction.toUpperCase()}** → *${ms(
									Date.now() - new Date(infraction.createdAt).getTime(),
									{
										long: true
									}
								)} ago*`
						)
						.join("\n")}`
				)
				.setFooter(`Case Count ${infractions.length}`, this.client.user!.displayAvatarURL())
				.setTimestamp()
		);
	}

	private async showCase(message: Message, user: User, caseID: number) {
		const [infraction] = await this.client.set.infractions.find({ where: { user: { id: user.id }, caseID } });

		if (!infraction) throw "Case not found.";

		return message.channel.send(
			new MessageEmbed()
				.setColor(message.member?.displayHexColor ?? "")
				.setAuthor(`${user.tag} (${user.id})`, user.displayAvatarURL())
				.setDescription([
					`**Action:** ${infraction.showAction}`,
					`**User:** ${user.tag}`,
					`**Reason:** ${infraction.reason || "No reason was provided."}`
				])
				.setFooter(`Infraction Case ${infraction.caseID}`, this.client.user!.displayAvatarURL())
				.setTimestamp()
		);
	}
}
