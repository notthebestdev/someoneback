import { DiscordHono } from 'discord-hono';

const app = new DiscordHono()
	.command('help', async (c) => {
		const helpMessage = `**Available Commands:**
- \`/someone [ignore-bots]\`: Ping a random member from the server. Optionally ignore bot users.
- \`/ping\`: Replies with the current ping.
- \`/help\`: Provides help information for available commands.

To use a command, type \`/\` followed by the command name. For example, to ping a random member, type \`/someone\`. You can add the optional parameter \`ignore-bots\` to exclude bot users from being selected.
-# Source code is available on [GitHub](https://github.com/notthebestdev/someoneback).`;

		return c.res(helpMessage);
	})
	.command('someone', async (c) => {
		// check if user has permission to mention everyone
		const memberPermissions = c.interaction.member?.permissions;
		if (!memberPermissions) return c.res('<a:crossmark:1454281378295451648> **Unable to verify permissions.**');

		const hasMentionEveryonePermission = BigInt(memberPermissions) & BigInt(0x20000);
		if (!hasMentionEveryonePermission) {
			return c.res('<a:crossmark:1454281378295451648> **You need the Mention Everyone permission to use this command.**');
		}

		// get guild id
		const guildId = c.interaction.guild?.id;
		if (!guildId) return c.res('<a:crossmark:1454281378295451648> **Guild not found.**');

		const env = c.env as { DISCORD_TOKEN?: string };
		const token = env.DISCORD_TOKEN || process.env.BOT_TOKEN;
		if (!token) return c.res('<a:crossmark:1454281378295451648> **Bot token not found in env.**');

		// fetch members, limit to 1000 due to discord api limitation
		const resp = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members?limit=1000`, {
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
		if (allMembers.length === 0) return c.res('<a:crossmark:1454281378295451648> **No members found.**');

		// apply bot filter if requested and always exclude self
		const selfId = c.interaction.member?.user?.id;
		const filtered = allMembers.filter((m) => {
			const isBot = m.user?.bot === true;
			const isSelf = m.user?.id === selfId;
			if (ignoreBots && isBot) return false;
			if (isSelf) return false;
			return true;
		});

		if (filtered.length === 0) return c.res('<a:crossmark:1454281378295451648> **No members match the filter (all results were bots or yourself).**');

		// pick a random member
		const randomMember = filtered[Math.floor(Math.random() * filtered.length)];
		const userId = randomMember.user?.id;
		if (!userId) return c.res('<a:crossmark:1454281378295451648> **User ID not found.**');

		return c.res(`**<a:confetti:1437507874614939789> <@${userId}>, you have been chosen!**`);
	})
	.command('ping', async (c) => {
		const start = Date.now();
		await fetch('https://discord.com/api/v10/users/@me'); // yes, that was the only way I found to get a measurable latency, dont judge me please :D
		const end = Date.now();
		const latency = end - start;
		return c.res(`**<a:sparkles:1454282222210125959> Pong!** \n-# Latency: ${latency}ms`);
	});

export default app;
