const { fetchJson } = require("../lib/functions");
const { downloadTiktok } = require("@mrnima/tiktok-downloader");
const cheerio = require("cheerio");
const axios = require("axios");
const { cmd, commands } = require('../command');
const getFBInfo = require("@xaviabot/fb-downloader");
const pakaya = "`"

cmd({
  pattern: "apk",
  desc: "Download APK from Aptoide.",
  react: "📦",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("🥲 *Please Give Me A APK Name To Search*");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.datalist || !data.datalist.list.length) {
      return reply("⚠️ No results found for the given app name.");
    }

    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2); // Convert bytes to MB

    const caption = `CRYPTO-XMD V2

*╭⦁⦂⦁━[ File Informations ]━⦁⦂⦁*
*┃*
*┃* 🌴 *Name* : ${app.name}
*┃* 
*┃* 🏋️ *Size* : ${appSize} MB
*┃*
*┃* 📦 *Package* : ${app.package}
*┃*
*┃* 📅 *Updated On* : ${app.updated}
*┃*
*┃* 👨‍💻 *Developer* : ${app.developer.name}
*┃*
*╰⦁⦂⦁━┉━┉━┉━┉━┉┉━⦁⦂⦁*

> POWERED BY DTZ!`;

    await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

    await conn.sendMessage(from, {
      document: { url: app.file.path_alt },
      fileName: `${app.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption: caption
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the APK. Please try again.");
  }
});


cmd({
    pattern: "tiktok",
    alias: ["ttdl2", "tt2", "tiktokdl2"],
    desc: "Download TikTok video without watermark",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("Please provide a TikTok video link.");
        if (!q.includes("tiktok.com")) return reply("Invalid TikTok link.");
        
        reply("Downloading video, please wait...");
        
        const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${q}`;
        const { data } = await axios.get(apiUrl);
        
        if (!data.status || !data.data) return reply("Failed to fetch TikTok video.");
        
        const { title, like, comment, share, author, meta } = data.data;
        const videoUrl = meta.media.find(v => v.type === "video").org;
        
        const caption = `🎵 *TikTok Video* 🎵\n\n` +
                        `👤 *User:* ${author.nickname} (@${author.username})\n` +
                        `📖 *Title:* ${title}\n` +
                        `👍 *Likes:* ${like}\n💬 *Comments:* ${comment}\n🔁 *Shares:* ${share}`;
        
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });
        
    } catch (e) {
        console.error("Error in TikTok downloader command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
      
          
    


cmd({
  pattern: "fb",
  alias: ["fbdl"],
  desc: "Download Facebook videos",
  category: "download",
  filename: __filename
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {

  if (!q || !q.startsWith("https://")) {
    return conn.sendMessage(from, { text: "❌ Please provide a valid URL." }, { quoted: mek });
}

await conn.sendMessage(from, { react: { text: "💡", key: mek.key } });

const result = await getFBInfo(q);

    const captionHeader = `*╭─────────────⊶*
*│*🎥 *${pakaya}𝙵𝙱 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁${pakaya}*
*╰─────────────────⊶*
*┏━━━━━━━━━━━━━━━━━━━━┓*
*┃ 🎥 ${pakaya}ᴛɪᴛʟᴇ:${pakaya}* ${result.title}
*┃ 🔗 ${pakaya}ᴜʀʟ:${pakaya}* -=-${q} 
*┗━━━━━━━━━━━━━━━━━━━━┛*

🔢 *${pakaya}ʀᴇᴘʟʏ ʙᴇʟᴏᴡ ɴᴜᴍʙᴇʀ:${pakaya}*

*[1] ${pakaya}𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 𝗩𝗜𝗗𝗘𝗢${pakaya}*🎥
*1.1 | | 🪫 ꜱᴅ Qᴜᴀʟɪᴛʏ*
*1.2 | | 🔋 ʜᴅ Qᴜᴀʟɪᴛʏ*

*[2] ${pakaya}𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 𝗔𝗨𝗗𝗜𝗢${pakaya}*🎧
*2.1 | | 🎶 ᴀᴜᴅɪᴏ ꜰɪʟᴇ*
*2.2 | | 🗃️ ᴅᴏᴄᴜᴍᴇɴᴛ ꜰɪʟᴇ*
*2.3 | | 🎤 ᴠᴏɪᴄᴇ ᴄᴜᴛ [ptt]*

♯ *${pakaya}POWERED BY DTZ!${pakaya}*
`;

const sentMsg = await conn.sendMessage(from, {
  image: { url: result.thumbnail}, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
  caption: captionHeader,
  contextInfo: {
      mentionedJid: ['94776702385@s.whatsapp.net'], // specify mentioned JID(s) if any
      groupMentions: [],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
          newsletterJid: '@newsletter',
          newsletterName: "CRYPTO-XMD-V2",
          serverMessageId: 999
      },
      externalAdReply: {
          title: 'CRYPTO-XMD-V2',
          body: 'CRYPTO-XMD-V2',
          mediaType: 1,
          sourceUrl: "https://github.com/",
          thumbnailUrl: result.thumbnail, // This should match the image URL provided above
          renderLargerThumbnail: false,
          showAdAttribution: true
      }
  }
});
const messageID = sentMsg.key.id; // Save the message ID for later reference


// Listen for the user's response
conn.ev.on('messages.upsert', async (messageUpdate) => {
    const mek = messageUpdate.messages[0];
    if (!mek.message) return;
    const messageType = mek.message.conversation || mek.message.extendedTextMessage?.text;
    const from = mek.key.remoteJid;
    const sender = mek.key.participant || mek.key.remoteJid;

    // Check if the message is a reply to the previously sent message
    const isReplyToSentMsg = mek.message.extendedTextMessage && mek.message.extendedTextMessage.contextInfo.stanzaId === messageID;

    if (isReplyToSentMsg) {
        // React to the user's reply (the "1" or "2" message)
        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
        
        

        // React to the upload (sending the file)
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        if (messageType === '1.1') {
            // Handle option 1 (sd File)
            await conn.sendMessage(from, {
              video: { url: result.sd}, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
              caption: "*♯ `POWERED BY DTZ!`*",
              contextInfo: {
                  mentionedJid: ['94776702385@s.whatsapp.net'], // specify mentioned JID(s) if any
                  groupMentions: [],
                  forwardingScore: 999,
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                      newsletterJid: '@newsletter',
                      newsletterName: "CRYPTO-XMD-V2",
                      serverMessageId: 999
                  },
                  externalAdReply: {
                      title: 'CRYPTO-XMD-V2',
                      body: 'CRYPTO-XMD-V2 ꜰᴀᴄᴇʙᴏᴏᴋ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ',
                      mediaType: 1,
                      sourceUrl: "https://githu",
                      thumbnailUrl: result.thumbnail, // This should match the image URL provided above
                      renderLargerThumbnail: false,
                      showAdAttribution: true
                  }
              }
            });
          }

          else if (messageType === '1.2') {
            // Handle option 2 (hd File)
            await conn.sendMessage(from, {
              video: { url: result.hd}, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
              caption: "*♯ `POWERED BY DTZ!`*",
              contextInfo: {
                  mentionedJid: ['94776702385@s.whatsapp.net'], // specify mentioned JID(s) if any
                  groupMentions: [],
                  forwardingScore: 999,
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                      newsletterJid: '@newsletter',
                      newsletterName: "POWERED BY DTZ!",
                      serverMessageId: 999
                  },
                  externalAdReply: {
                      title: 'POWERED BY DTZ!',
                      body: 'CRYPTO-XMD-V2 ꜰᴀᴄᴇʙᴏᴏᴋ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ',
                      mediaType: 1,
                      sourceUrl: "https://gub.comaaa777",
                      thumbnailUrl: result.thumbnail, // This should match the image URL provided above
                      renderLargerThumbnail: false,
                      showAdAttribution: true
                  }
              }
            });
          }
           
          else if (messageType === '2.1') {
            //Handle option 3 (audio File)  
          await conn.sendMessage(from, { audio: { url: result.sd }, mimetype: "audio/mpeg" }, { quoted: mek })
          }
          
          else if (messageType === '2.2') {
            await conn.sendMessage(from, {
              document: { url: result.sd },
              mimetype: "audio/mpeg",
              fileName: ` CRYPTO-XMD-V2.mp3`,
              caption: "*♯ `POWERED BY DTZ!`*",
              contextInfo: {
                mentionedJid: ['94776702385@s.whatsapp.net'], // specify mentioned JID(s) if any
                groupMentions: [],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '@newsletter',
                    newsletterName: "CRYPTO-XMD-V2",
                    serverMessageId: 999
                },
                externalAdReply: {
                    title: 'CRYPTO-XMD-V2',
                    body: 'CRYPTO-XMD-V2 ꜰᴀᴄᴇʙᴏᴏᴋ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ',
                    mediaType: 1,
                    sourceUrl: "https://github.com",
                    thumbnailUrl: result.thumbnail, // This should match the image URL provided above
                    renderLargerThumbnail: false,
                    showAdAttribution: true
                }
            }
          }, { quoted: mek });
          }
          
          else if (messageType === '2.3') {
            //Handle option 3 (audio File)  
          await conn.sendMessage(from, { audio: { url: result.sd }, mimetype: 'audio/mp4', ptt: true }, { quoted: mek })
    
          }

        // React to the successful completion of the task
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

        console.log("Response sent successfully");
    }
  });
} catch (e) {
console.log(e);
reply(`${e}`);
}
})

