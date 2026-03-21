# Contributing to SomeoneBack

Thanks for wanting to contribute.

This project is a Discord bot running on Cloudflare Workers with `discord-hono` and TypeScript.

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [How Commands Work](#how-commands-work)
- [Adding or Changing a Command](#adding-or-changing-a-command)
- [Local Quality Checks](#local-quality-checks)
- [Reporting Bugs](#reporting-bugs)
- [Security](#security)
- [Pull Request Checklist](#pull-request-checklist)

## Quick Start

### 1) Prerequisites

- Node.js (current LTS recommended)
- npm
- Wrangler (`npm install -g wrangler`)

### 2) Install dependencies

```bash
npm install
```

### 3) Configure environment variables

Create a local `.env` file for command registration:

```env
DISCORD_APPLICATION_ID=your_application_id
DISCORD_TOKEN=your_bot_token
DISCORD_PUBLIC_KEY=your_public_key
```

For deployment, set secrets in Cloudflare:

```bash
npx wrangler secret put DISCORD_APPLICATION_ID
npx wrangler secret put DISCORD_PUBLIC_KEY
npx wrangler secret put DISCORD_TOKEN
```

### 4) Register commands and deploy

```bash
npm run register
npm run deploy
```

## Project Structure

- `src/index.ts`: Worker entry point and command mounting.
- `src/register.ts`: Registers slash commands with Discord.
- `src/commands/`: Individual command handlers.
- `src/utils/members.ts`: Discord member fetching/filtering helpers.
- `src/utils/permissions.ts`: Permission bit checks.

## How Commands Work

Current slash commands:

- `/someone [ignore-bots]`
- `/ping`
- `/help`

Flow:

1. Commands are defined for Discord in `src/register.ts`.
2. Commands are mounted in the Worker app in `src/index.ts`.
3. Each command handler lives in `src/commands/*.ts` and returns a Discord response with `c.res(...)`.

`/someone` specifics:

- Requires the **Mention Everyone** permission (checked in `hasRequiredPermissions`).
- Fetches up to 1000 guild members via Discord REST API.
- Optionally excludes bots with the `ignore-bots` option.
- Excludes the command invoker.
- Chooses a target using `crypto.randomInt`.

## Adding or Changing a Command

When adding a new command, update all of the following:

1. Add a handler file in `src/commands/`.
2. Export it from `src/commands/index.ts`.
3. Mount it in `src/index.ts`.
4. Register it in `src/register.ts`.
5. Update help text in `src/commands/help.ts`.

If your command touches guild members or permissions, prefer reusing logic in `src/utils/members.ts` and `src/utils/permissions.ts` instead of duplicating checks.

## Local Quality Checks

Run these before opening a PR:

```bash
npm run lint
npm run format
```

Useful additional commands:

- `npm run deploy` to deploy Worker updates.
- `npm run log` to inspect Worker logs in real time.
- `npm run cf-typegen` to refresh Cloudflare Worker types.

## Reporting Bugs

Please open a GitHub issue and include:

- What happened vs what you expected.
- Clear reproduction steps.
- Relevant environment details (OS, Node.js version, npm version).
- Logs or error messages when available.

## Security

Do not open public issues for vulnerabilities or sensitive data leaks.

Send security reports to: <contact@justinn.dev>

## Pull Request Checklist

Before submitting a PR:

- Keep changes focused and minimal.
- Follow existing TypeScript style and naming.
- Run lint, tests, and format.
- Update docs/help text when behavior changes.
- Add or update tests for logic changes.
- Include a clear PR description (what changed and why).

By contributing, you confirm you have rights to your contribution and agree to license it under this project's license.
