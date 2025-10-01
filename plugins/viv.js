const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Crypto = require("crypto");
const { cmd } = require("../command");
const {sleep} = require('../lib/functions')

cmd({
    pattern: "vv",
    desc: "Bypass ViewOnce and resend media",
    category: "media",
    react: "🧚‍♂️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        if (!quoted) {
            return reply("⚠️ කරුණාකර ViewOnce image හෝ Video එකක් quote කරන්න!");
        }

        const quot = mek.msg.contextInfo.quotedMessage;
        const cap = quot?.msg?.caption || '';
        let mediaType = '';

        if (quoted.type.includes("image")) {
            mediaType = "jpg";
        } else if (quoted.type.includes("video")) {
            mediaType = "mp4";
        } else {
            mediaType = "mp3";
        }

        const tempFileName = `Golden_Queen_MD_${Crypto.randomBytes(8).toString('hex')}.${mediaType}`;
        const tempFilePath = path.resolve(tempFileName);

        // Download media
        const mediaBuffer = await quoted.download();
        if (!mediaBuffer) {
            return reply("⚠️ Failed to download the media. Please try again.");
        }

        fs.writeFileSync(tempFilePath, mediaBuffer);

        if (!fs.existsSync(tempFilePath)) {
            return reply("⚠️ Media file could not be found after download.");
        }

        if (quoted.type.includes("image")) {
            await conn.sendMessage(from, {
                image: { url: tempFilePath },
                caption: cap + `> 𝐏ᴏᴡᴇʀᴅ ʙʏ 𝐅ʀᴇᴇᴅᴏᴍ ❗`
            }, { quoted: mek });
        } else if (quoted.type.includes("video")) {
            await conn.sendMessage(from, {
                video: { url: tempFilePath },
                caption: cap + `> 𝐏ᴏᴡᴇʀᴅ ʙʏ 𝐅ʀᴇᴇᴅᴏᴍ ❗`,
                mimetype: "video/mp4"
            }, { quoted: mek });
        } else {
            await conn.sendMessage(from, {
                audio: { url: tempFilePath },
                mimetype: "audio/mp4",
                ptt: true
            }, { quoted: mek });
        }

        // Remove temp file
        await fs.unlinkSync(tempFilePath);

    } catch (error) {
        console.log(error);
        reply("⚠️ Error occurred while processing ViewOnce media.");
    }
});
