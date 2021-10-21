# LiFeBot

## Table of Contents

- [Install](#install)
- [Find the Bot Token](#find-the-bot-token)
- [Find the Bot ID](#find-the-bot-id)
- [NodeJS](#nodejs)

## Install

Before you follow this, make sure you use [NodeJS](#nodejs) version 16 or higher and npm version 8 or higher.

- `git clone https://github.com/LIFEBOTDEV/LiFeBot.js.git`
- `cd LiFeBot.js`
- `npm install`
- `echo "BOT_TOKEN=<YOUR TOKEN>" >> .env ; echo "CLIENTID=<YOUR CLIENT ID>" >> .env`
- `node deploy-commands.js`
- `node LiFeBot.js`

## Find the Bot Token
- Go tho the [discord developer portal](https://discord.com/developers/applications)
- Click on `New Application`, give your bot a name and click on `Create`
- On the left side, click on `Bot`
- Click on `Add Bot`
- Now, you should see a new `Build-A-Bot` section. In the `Token` section of this, click on `Copy`. Do not share this token with anyone!

## Find the Bot ID

  Make sure that you share a server with the bot you created. if not, go to the [invite](#invite-the-bot) section.

- Enable the developer mode in Discord. Go to Settings > Advanced and enable it there
- Right click the bot in the server list
- Click on `Copy ID`

## Invite the Bot

  Make sure that you have already created a bot application. If not, follow the steps under [Find the Bot Token](#find-the-bot-token).

- Go to the [discord developer portal](https://discord.com/developers/applications) and click on your application (bot)
- On the left side, click on `OAuth2`
- Scroll down to the `Scopes` section
- Select `bot` and `application.commands`
- Scroll down a bit more to the `Bot Permissions` section
- Select `Administrator`
- Go back to the `Scopes` section and click on `Copy`
- Now paste the copied url into a new tab and add the bot to your server

## NodeJS

- Go to the [NodeJS Website](https://nodejs.org/en/) and download the current version
- Install the downloaded file