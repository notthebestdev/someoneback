import crypto from 'crypto';
import { hasRequiredPermissions } from '../utils/permissions';
import { fetchGuildMembers, filterMembers } from '../utils/members';
import type { CommandContext } from 'discord-hono';

export const someoneCommand = async (c: CommandContext) => {
	// Check if user has permission to mention everyone
	const memberPermissions = c.interaction.member?.permissions;
	if (!memberPermissions) {
		return c.res('<a:crossmark:1454281378295451648> **Unable to verify permissions.**');
	}

	if (!hasRequiredPermissions(memberPermissions)) {
		return c.res('<a:crossmark:1454281378295451648> **You need the Mention Everyone permission to use this command.**');
	}

	// Get guild id
	const guildId = c.interaction.guild?.id;
	if (!guildId) return c.res('<a:crossmark:1454281378295451648> **Guild not found.**');

	const env = c.env as { DISCORD_TOKEN?: string };
	const token = env.DISCORD_TOKEN || process.env.BOT_TOKEN;
	if (!token) return c.res('<a:crossmark:1454281378295451648> **Bot token not found in env.**');

	try {
		// Fetch members, limit to 1000 due to discord api limitation
		const allMembers = await fetchGuildMembers(guildId, token);

		if (allMembers.length === 0) {
			return c.res('<a:crossmark:1454281378295451648> **No members found.**');
		}

		// Check if ignore-bots option is set
		let ignoreBots = false;
		if ('options' in c.interaction.data && Array.isArray(c.interaction.data.options)) {
			const option = c.interaction.data.options.find((opt) => opt.name === 'ignore-bots');
			if (option && 'value' in option) {
				ignoreBots = (option.value as boolean) ?? false;
			}
		}

		// Filter members based on options and exclude self
		const selfId = c.interaction.member?.user?.id;
		const filtered = filterMembers(allMembers, !ignoreBots, selfId);

		if (filtered.length === 0) {
			return c.res('<a:crossmark:1454281378295451648> **No members match the filter (all results were bots or yourself).**');
		}

		// Pick a random member using cryptographically secure randomness
		const randomIndex = crypto.randomInt(filtered.length);
		const randomMember = filtered[randomIndex];
		const userId = randomMember.user?.id;
		if (!userId) return c.res('<a:crossmark:1454281378295451648> **User ID not found.**');

		return c.res(`**<a:confetti:1437507874614939789> <@${userId}>, you have been chosen!**`);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return c.res(`<a:crossmark:1454281378295451648> **Error: ${errorMessage}**`);
	}
};
