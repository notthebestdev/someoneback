import { DiscordHono } from 'discord-hono';
import { helpCommand, pingCommand, someoneCommand } from './commands';

const app = new DiscordHono().command('help', helpCommand).command('someone', someoneCommand).command('ping', pingCommand);

export default app;
