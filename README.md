<p align="center">
 <img src="/.github/assets/icon.webp" alt="SomeoneBack Icon" width="128" height="128"/>
</p>

<h1 align="center">SomeoneBack</h1>

<p align="center">
 <a href="https://github.com/notthebestdev/someoneback/actions/workflows/release.yml">
  <img src="https://github.com/notthebestdev/someoneback/actions/workflows/release.yml/badge.svg" alt="Release"/>
 </a>
 <img src="https://badges.ws/badge/?icon=typescript&value=typescript" alt="Language">
 <img src="https://badges.ws/github/l/notthebestdev/someoneback" alt="License"/>
 <img src="https://badges.ws/github/stars/notthebestdev/someoneback" alt="Stars"/>
 <img src="https://badges.ws/github/forks/notthebestdev/someoneback" alt="Forks"/>
 <img src="https://badges.ws/github/last-commit/notthebestdev/someoneback" alt="Last Commit"/>
</p>

SomeoneBack brings back Discord's classic April Fools' "@someone" mention from March 31, 2018. This bot lets you randomly mention a user—perfect for giveaways, selections, and more.

- [Invite SomeoneBack to your Discord server](https://discord.com/oauth2/authorize?client_id=1235630388404289658) <img src="/.github/assets/discord.svg" align="left" width="24">.

## Getting Started <img src="/.github/assets/sparkles.svg" align="left" width="24">

### Prerequisites <img src="/.github/assets/brain.svg" align="left" width="24">

- [Node.js](https://nodejs.org/) and npm installed
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) installed globally (`npm install -g wrangler`)

### Install dependencies <img src="/.github/assets/package.svg" align="left" width="24">

```bash
npm install
```

### Set up Discord bot secrets <img src="/.github/assets/lock.svg" align="left" width="24">

Use Wrangler to securely store your Discord bot credentials:

```bash
npx wrangler secret put DISCORD_APPLICATION_ID
npx wrangler secret put DISCORD_PUBLIC_KEY
npx wrangler secret put DISCORD_TOKEN
```

### Register and deploy your bot <img src="/.github/assets/rocket.svg" align="left" width="24">

- `npm run register`: Registers your bot commands with Discord.
- `npm run deploy`: Deploys your bot to Cloudflare Workers.

```bash
npm run register
npm run deploy
```
