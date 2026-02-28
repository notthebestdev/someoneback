/**
 * Fetches members from a Discord guild
 */
export async function fetchGuildMembers(
	guildId: string,
	token: string,
	limit: number = 1000
): Promise<Array<{ user?: { id?: string; username?: string; bot?: boolean } }>> {
	const resp = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members?limit=${limit}`, {
		headers: { Authorization: `Bot ${token}` },
	});

	if (!resp.ok) {
		throw new Error(`Failed to fetch members: ${resp.status} ${resp.statusText}`);
	}

	return (await resp.json()) as Array<{ user?: { id?: string; username?: string; bot?: boolean } }>;
}

/**
 * Filters members based on ignore bots flag and self ID
 */
export function filterMembers(
	members: Array<{ user?: { id?: string; username?: string; bot?: boolean } }>,
	includeBots: boolean,
	selfId?: string
): Array<{ user?: { id?: string; username?: string; bot?: boolean } }> {
	return members.filter((m) => {
		const isBot = m.user?.bot === true;
		const isSelf = m.user?.id === selfId;

		if (!includeBots && isBot) return false;
		if (isSelf) return false;
		return true;
	});
}
