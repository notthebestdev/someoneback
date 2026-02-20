import { DiscordHono } from 'discord-hono';
import ky from 'ky';
import getLanguageFromServer from './utils/getLanguageFromServer';
import getFileFromLanguage from './utils/getFileFromLanguage';
import type { FileLanguage } from './types/fileLanguage';

import crypto from 'crypto';
const app = new DiscordHono()
	.command('help', async (c) => {
		const guildId = c.interaction.guild?.id as string;
		let lang: FileLanguage = getFileFromLanguage('en') as FileLanguage;
		await getLanguageFromServer(guildId, c).then((language) => {
			lang = getFileFromLanguage(language) as FileLanguage;
		});
		const helpMessage = lang.HELP_MESSAGE;

		return c.res(helpMessage);
	})
	.command('someone', async (c) => {
		// check if user has permission to mention everyone
		const guildId = c.interaction.guild?.id;
		const memberPermissions = c.interaction.member?.permissions;
		if (!guildId) return c.res('<a:crossmark:1454281378295451648> **Guild not found.**');
		let lang: FileLanguage = getFileFromLanguage('en') as FileLanguage;
		await getLanguageFromServer(guildId, c).then((language) => {
			lang = getFileFromLanguage(language) as FileLanguage;
		});
		if (!memberPermissions) return c.res(lang.PERMISSIONS_ERROR);

		const hasMentionEveryonePermission = BigInt(memberPermissions) & BigInt(0x20000);
		if (!hasMentionEveryonePermission) {
			return c.res(lang.MENTION_EVERYONE_PERMISSION_MISSING);
		}

		// get guild id
		if (!guildId) return c.res(lang.GUILD_NOT_FOUND);

		const env = c.env as { DISCORD_TOKEN?: string };
		const token = env.DISCORD_TOKEN || process.env.BOT_TOKEN;
		if (!token) return c.res(lang.BOT_TOKEN_NOT_FOUND_ERROR);

		// fetch members, limit to 1000 due to discord api limitation
		const resp = await ky.get(`https://discord.com/api/v10/guilds/${guildId}/members`, {
			searchParams: { limit: '1000' },
			headers: { Authorization: `Bot ${token}` },
		});
		if (!resp.ok) return c.res(`Failed to fetch members: ${resp.status} ${resp.statusText}`);

		// filter out bots if option is set
		let ignoreBots = false;
		if ('options' in c.interaction.data && Array.isArray(c.interaction.data.options)) {
			const option = c.interaction.data.options.find((opt) => opt.name === 'ignore-bots');
			if (option && 'value' in option) {
				ignoreBots = (option.value as boolean) ?? false;
			}
		}
		const allMembers = (await resp.json()) as Array<{ user?: { id?: string; username?: string; bot?: boolean } }>;
		if (allMembers.length === 0) return c.res(lang.NO_MEMBERS_ERROR);

		// apply bot filter if requested and always exclude self
		const selfId = c.interaction.member?.user?.id;
		const filtered = allMembers.filter((m) => {
			const isBot = m.user?.bot === true;
			const isSelf = m.user?.id === selfId;
			if (ignoreBots && isBot) return false;
			if (isSelf) return false;
			return true;
		});

		if (filtered.length === 0) return c.res(lang.NO_MEMBERS_MATCH_FILTER_ERROR);

		// pick a random member using cryptographically secure randomness (CVE-338 compliant)
		const randomIndex = crypto.randomInt(filtered.length);
		const randomMember = filtered[randomIndex];
		const userId = randomMember.user?.id;
		if (!userId) return c.res(lang.USER_ID_NOT_FOUND_ERROR);

		return c.res(lang.YOU_HAVE_BEEN_CHOSEN.replace('{{USER_ID}}', `<@${userId}>`));
	})
	.command('ping', async (c) => {
		let lang: FileLanguage = getFileFromLanguage('en') as FileLanguage;
		const guildId = c.interaction.guild?.id as string;
		await getLanguageFromServer(guildId, c).then((language) => {
			lang = getFileFromLanguage(language) as FileLanguage;
		});
		const start = Date.now();
		await fetch('https://discord.com/api/v10/users/@me'); // yes, that was the only way I found to get a measurable latency, dont judge me please :D
		const end = Date.now();
		const latency = end - start;
		return c.res(lang.PING.replace('{{LATENCY}}', latency.toString()));
	});

export default app;
