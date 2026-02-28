import type { CommandContext } from 'discord-hono';

export const pingCommand = async (c: CommandContext) => {
	const start = Date.now();
	await fetch('https://discord.com/api/v10/users/@me');
	const end = Date.now();
	const latency = end - start;
	return c.res(`**<a:sparkles:1454282222210125959> Pong!** \n-# Latency: ${latency}ms`);
};
