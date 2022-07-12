# LiFeBot

## Table of Contents

- Installing the bot
- Finding your bot's token
- Inviting your bot
- Installing Docker

---

<details>
<summary>
Installing the bot
</summary>
<br>

Before you follow this, make sure that you have Docker installed.

- Grab the [docker compose file](https://gist.github.com/LinusPotocnik/0b6c47888b70755d6e87333da4155d4d) and put it in a directory of your choice (where you want to run the bot)
- In the command line, navigate into that directory
- Run `echo "BOT_TOKEN=<YOUR TOKEN>" >> .env`
- Run `docker compose up`

The bot will now run and automatically check for updates every 24hrs

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
Installing Docker
</summary>
<br>

- On Windows and macOS, you can simply install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- On Linux, I prefer using the installation script.

```
$ curl -fsSL https://get.docker.com -o get-docker.sh
$ sudo sh get-docker.sh
```

</details>
