import { DiscordHono } from 'discord-hono';

const app = new DiscordHono()
	.command('someone', async (c) => {
		// check if user has permission to mention everyone
		const memberPermissions = c.interaction.member?.permissions;
		if (!memberPermissions) return c.res('❌ **Unable to verify permissions.**');

		const hasMentionEveryonePermission = BigInt(memberPermissions) & BigInt(0x20000);
		if (!hasMentionEveryonePermission) {
			return c.res('❌ **You need the Mention Everyone permission to use this command.**');
		}

		// get guild id
		const guildId = c.interaction.guild?.id;
		if (!guildId) return c.res('❌ **Guild not found.**');

		const env = c.env as { DISCORD_TOKEN?: string };
		const token = env.DISCORD_TOKEN || process.env.BOT_TOKEN;
		if (!token) return c.res('❌ **Bot token not found in env.**');

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
		if (allMembers.length === 0) return c.res('❌ **No members found.**');

		// apply bot filter if requested and always exclude self
		const selfId = c.interaction.member?.user?.id;
		const filtered = allMembers.filter((m) => {
			const isBot = m.user?.bot === true;
			const isSelf = m.user?.id === selfId;
			if (ignoreBots && isBot) return false;
			if (isSelf) return false;
			return true;
		});

		if (filtered.length === 0) return c.res('❌ **No members match the filter (all results were bots or yourself).**');

		// pick a random member
		const randomMember = filtered[Math.floor(Math.random() * filtered.length)];
		const userId = randomMember.user?.id;
		if (!userId) return c.res('❌ **User ID not found.**');

		return c.res(`**🎉 <@${userId}>, you have been chosen!**`);
	})
	.command('ping', async (c) => {
		const start = Date.now();
		await fetch('https://discord.com/api/v10/users/@me'); // yes, that was the only way I found to get a measurable latency, dont judge me please :D
		const end = Date.now();
		const latency = end - start;
		return c.res(`**🏓 Pong!** \n-# Latency: ${latency}ms`);
	});

export default app;
