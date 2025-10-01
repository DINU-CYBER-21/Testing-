const { cmd } = require("../command");
const fetch = require("node-fetch");

cmd({
  pattern: 'short',
  alias: ["shorturl", "tiny"],
  desc: "Shorten a long URL using TinyURL",
  react: '🔗',
  category: "utility",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  args,
  reply
}) => {
  if (!args[0]) {
    return reply("❌ Please provide a valid URL to shorten.\n\nExample:\n.short https://example.com");
  }

  const longUrl = args[0];
  const isValidUrl = /^https?:\/\/\S+$/i.test(longUrl);

  if (!isValidUrl) {
    return reply("⚠️ Invalid URL format. Please enter a proper link starting with http or https.");
  }

  try {
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
    const shortUrl = await res.text();

    if (!shortUrl.startsWith('http')) {
      throw new Error("Shortening failed.");
    }

    await conn.sendMessage(from, {
      text: `🔗 *URL Shortened Successfully!*\n\n🌐 Original: ${longUrl}\n🧬 Short: ${shortUrl}\n\n> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ° 𝐃ɪɴᴜ x ʟɪᴛ𝐄 °*`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363402466616623@newsletter',
          newsletterName: '✨° 𝐃ɪɴᴜ x ʟɪᴛ𝐄 ° ✨',
          serverMessageId: 143
        }
      }
    }, { quoted: m });

  } catch (err) {
    console.error("Shortener Error:", err);
    reply("❌ Failed to shorten the URL. Please try again later.");
  }
});