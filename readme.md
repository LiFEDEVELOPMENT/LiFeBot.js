# LiFeBot

## Table of Contents

- Installing the bot
- Finding your bot's token
- Finding your bot's ID
- Inviting your bot
- Installing NodeJS/npm
- Updating NodeJS
- Updating npm
- Installing Git on Windows

---

<details>
<summary>
Installing the bot
</summary>
<br>

Before you follow this, make sure you use NodeJS version 16.9.0 or higher and npm version 8 or higher. You can check the versions of both by running `npm version` in your command line

- Grab the [latest release](https://github.com/LIFEBOTDEV/LiFeBot.js/releases) and unzip it
- In the command line, navigate into the unzipped folder
- Run `npm install`
- Run `echo "BOT_TOKEN=<YOUR TOKEN>" >> .env ; echo "CLIENTID=<YOUR CLIENT ID>" >> .env`
- Run `node deploy-commands.js`
- Run `node LiFeBot.js`
</details>

---

<details>
<summary>
Finding your bot token
</summary>
<br>

- Go tho the [Discord developer portal](https://discord.com/developers/applications)
- Click on `New Application`, give your bot a name and click on `Create`
- On the left side, click on `Bot`
- Click on `Add Bot`
- Now, you should see a new `Build-A-Bot` section. In the `Token` subsection of this, click on `Copy`

NOTE: Do NOT share this token with anyone!

</details>

---

<details>
<summary>
Finding your bot's ID
</summary>
<br>

Make sure that you share a server with the bot you created. If this is not the case, go to the Invite section of this tutorial.

- Enable the developer mode in Discord. Go to Settings > Advanced and enable it there
- Right click the bot in the server list
- Click on `Copy ID`
</details>

---

<details>
<summary>
Inviting your bot
</summary>
<br>
Make sure that you have already created a bot application. If not, follow the steps under 'Finding your bot's token'.

- Go to the [Discord developer portal](https://discord.com/developers/applications) and click on your application (bot)
- On the left side, click on `OAuth2` -> `URL Generator`
- Select `bot` and `application.commands`
- In the `Bot Permissions` section, select `Administrator`
- Scroll down to the bottom of the page and click on `Copy`
- Now paste the copied url into a new tab and add the bot to your server
</details>

---

<details>
<summary>
Installing NodeJS and npm
</summary>
<details>
<summary>
Windows and macOS
</summary>
<br>

- Go to the [NodeJS website](https://nodejs.org/en/) and download the current version
- Install the downloaded file. This installation includes npm
</details>
<details>
<summary>
Linux
</summary>
<br>

- Update Linux
  `sudo apt-get update -y`
- Download node with curl
  `curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -`
  (change the 16 to a different version if you wish to install a version of node that is not v16)
- Install node
  `sudo apt install nodejs`
- Verify installation
`node -v`
</details>
</details>

---

<details>
<summary>
Updating NodeJS
</summary>
<br>

If you have an older version of NodeJS you can update it.
If you are on a Windows machine, use all commands without a sudo and execute the terminal with administrator permissions.

- `npm cache clean -f`
- `sudo npm install -g n`
- `sudo n latest`
</details>

---

<details>
<summary>
Updating npm
</summary>
<details>
<summary>
macOS and Linux
</summary>
<br>

- `sudo npm install -g npm@latest`
</details>

For Windows, please follow the [official npm guide for Windows](https://docs.npmjs.com/try-the-latest-stable-version-of-npm#upgrading-on-windows)

</details>

---

<details>
<summary>
Installing Git on Windows
</summary>
<br>

- Head to the [official git website](https://git-scm.com/download/win) to download the Windows installer
- Install the downloaded file
- Start the git bash terminal instead of cmd and use it to perform git commands
</details>
