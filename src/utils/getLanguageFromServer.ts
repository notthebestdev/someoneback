import type { CommandContext } from 'discord-hono';
import ky from 'ky';

export default async function getLanguageFromServer(serverId: string, c: CommandContext): Promise<string> {
	// use ky as a workaround for custom endpoints not supported by client.rest
	const guid = await ky.get(`https://discord.com/api/v9/guilds/templates/${serverId}`, {
		headers: {
			Authorization: `Bot ${c.env.DISCORD_TOKEN || process.env.DISCORD_TOKEN}`,
			'Content-Type': 'application/json',
		},
	});

	if (!guid.ok) {
		// get serialized_source_guild.preferred_locale from response
		const data = (await guid.json()) as { serialized_source_guild?: { preferred_locale?: string } };
		return data?.serialized_source_guild?.preferred_locale || 'en';
	}

	const data = (await guid.json()) as { language?: string };
	return data.language || 'en';
}
