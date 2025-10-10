# SomeoneBack

SomeoneBack brings back Discord's classic April Fools' "@someone" mention from March 31, 2018. This bot lets you randomly mention a user—perfect for giveaways, selections, and more.

- Invite this bot to your Discord server [here](https://discord.com/oauth2/authorize?client_id=1235630388404289658).

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) and npm installed
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) installed globally (`npm install -g wrangler`)

### Install dependencies
```bash
npm install
```

### Set up Discord bot secrets
Use Wrangler to securely store your Discord bot credentials:
```bash
npx wrangler secret put DISCORD_APPLICATION_ID
npx wrangler secret put DISCORD_PUBLIC_KEY
npx wrangler secret put DISCORD_TOKEN
```

### Register and deploy your bot
- `npm run register`: Registers your bot commands with Discord.
- `npm run deploy`: Deploys your bot to Cloudflare Workers.

```bash
npm run register
npm run deploy
```