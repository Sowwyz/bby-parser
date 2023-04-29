const { Client, GatewayIntentBits, MessageAttachment } = require('discord.js');
const discord = require("discord.js")
require("colors")
const fs = require("fs")
const axios = require("axios")
const randomstring = require("randomstring");
const config = require("./config.json")

// If you using this bot only for you, set the Only1Server as true. Otherwise set as false.

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});


client.on("ready", () => {
    console.log(`[Ready Event]`.green + ` ${client.user.username}#${client.user.discriminator}`)
})

client.on("messageCreate", async (high) => {
    if (high.attachments.size < 0) return;
    if (high.author.id == client.user.id) return;
    if (high.attachments.size > 0) {
        if (high.attachments.every(attachIsTxt)) {
            if (high.attachments.first().name.startsWith("cookies.txt")) {
                await downloadFile(high.attachments.first().name, high.attachments.first().url, high)
            }
        }
    }
})

const str = randomstring.generate({
    length: 12,
    charset: 'alphabetic'
  });

function attachIsTxt(msgAttach) {
    var url = msgAttach.url;
    return url.indexOf("txt", url.length - "txt".length) !== -1;
}

async function downloadFile(filename, url, message) {
    var new_cookies = ""
    const resp = await axios({
        method: "get",
        url: url
    })
    console.log(resp.data)
    fs.writeFile(`./Cookies/${str}.txt`, resp.data, (err) => {
        if (err) return console.log(err)
        fs.readFileSync(`./Cookies/${str}.txt`, 'utf-8').split(/\r?\n/).forEach((line) => {
            if (line.includes("@~$~@bby-")) return;

            var host = line.split("|")[0]?.replace("HOST KEY: ", "").trim();
            var name = line.split("|")[1]?.replace(" NAME: ", "").trim();
            var value = line.split("|")[2]?.replace(" VALUE: ", "").trim();
            new_cookies += host + "	" + "TRUE" + "	/" + "	FALSE" + "	2597573456	" + name + "	" + value + "\n"

         })
        fs.writeFile(`./ParsedCookies/${str}.txt`, new_cookies, (err) => {
            if (err) return console.log(err)
            const attachment = new discord.AttachmentBuilder('./ParsedCookies/'+ str+'.txt', { name: 'cookies.txt' })
            message.channel.send({ files: [
                attachment
            ]})
        })
       
    })

}

client.login(config.Bot.Token)