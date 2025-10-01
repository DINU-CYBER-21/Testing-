const { cmd } = require("../command");
const fetch = require("node-fetch");
const config = require('../config');

var linkn = ''
if(config.LANG === 'EN') linkn = "❌ Where is the GitHub link?\n\nExample:\n.gitclone https://github.com/isithaanusara/CRYPTO-XMD-V2"
else linkn = "❌ Where is the GitHub link?\n\nExample:\n.gitclone https://github.com/isithaanusara/CRYPTO-XMD-V2"
var invalid = ''
if(config.LANG === 'EN') invalid = "ERROR:Please Enter A Valid Link!"
else invalid = "ERROR:Please Enter A Valid Link!"
var nf = ''
if(config.LANG === 'EN') nf = "ERROR:Repo Not Found!"
else nf = "ERROR:Repo Not Found!"


cmd({
  pattern: 'gitclone',
  alias: ["git"],
  desc: "Download GitHub repository as a zip file.",
  react: '📦',
  category: "downloader",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  args,
  reply
}) => {
  if (!args[0]) {
    return reply(linkn);
  }

  if (!/^(https:\/\/)?github\.com\/.+/.test(args[0])) {
    return reply(invalid);
  }

  try {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/i;
    const match = args[0].match(regex);

    if (!match) {
      throw new Error(invalid);
    }

    const [, username, repo] = match;
    const zipUrl = `https://api.github.com/repos/${username}/${repo}/zipball`;

    // Check if repository exists
    const response = await fetch(zipUrl, { method: "HEAD" });
    if (!response.ok) {
      throw new Error(nf);
    }

    const contentDisposition = response.headers.get("content-disposition");
    const fileName = contentDisposition ? contentDisposition.match(/filename=(.*)/)[1] : `${repo}.zip`;

    // Notify user of the download
    reply(`📥 *Downloading repository...*\n\n*Repository:* ${username}/${repo}\n*Filename:* ${fileName}\n\n> *©POWERED BY DTZ!*`);

    // Send the zip file to the user with custom contextInfo
    await conn.sendMessage(from, {
      document: { url: zipUrl },
      fileName: fileName,
      mimetype: 'application/zip',
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: 'your Channel JID@newsletter',
          newsletterName: 'CRYPTO-XMD-V2',
          serverMessageId: 143
        }
      }
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ Failed to download the repository. Please try again later.");
  }
});