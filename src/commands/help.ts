import type { CommandContext } from 'discord-hono';

export const helpCommand = async (c: CommandContext) => {
	const helpMessage = `**Available Commands:**
- \`/someone [ignore-bots]\`: Ping a random member from the server. Optionally ignore bot users.
- \`/ping\`: Replies with the current ping.
- \`/help\`: Provides help information for available commands.

To use a command, type \`/\` followed by the command name. For example, to ping a random member, type \`/someone\`. You can add the optional parameter \`ignore-bots\` to exclude bot users from being selected.
-# Source code is available on [GitHub](https://github.com/notthebestdev/someoneback).`;

	return c.res(helpMessage);
};
