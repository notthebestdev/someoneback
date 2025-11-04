import { Command, Option, register } from 'discord-hono';

const commands = [
	new Command('someone', 'Ping a random member from the server').options(new Option('ignore-bots', 'Ignore bot users', 'Boolean')),
	new Command('ping', 'Replies with the current ping'),
	new Command('help', 'Provides help information for available commands'),
];

register(commands, process.env.DISCORD_APPLICATION_ID, process.env.DISCORD_TOKEN);
