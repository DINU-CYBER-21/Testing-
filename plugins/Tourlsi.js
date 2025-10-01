const { cmd } = require("../command");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");
const config = require("../config");
const botPrefix = config.PREFIX;
cmd({
  pattern: "tourl",
  alias: ["imgtourl", "imgurl", "url"],
  react: "📤",
  desc: "Convert image to direct URL using imgbb",
  category: "tools",
  use: ".tourl (reply to image)",
  filename: __filename,
},
async (conn, mek, m, {
  from,
  quoted,
  reply,
}) => {
  try {
    const target = quoted ? quoted : m;
    const mimetype = (target.msg || target)?.mimetype || "";

    if (!mimetype || !mimetype.includes("image")) {
      return await reply(config.LANG === "SI"
        ? "*📸 කරුණාකර පින්තූරයක් reply කරන්න!*"
        : "*📸 Please reply to an image!*");
    }

    const buffer = await target.download();
    const tempFile = path.join(os.tmpdir(), "dinu.jpg");
    fs.writeFileSync(tempFile, buffer);

    const form = new FormData();
    form.append("image", fs.createReadStream(tempFile));

    const response = await axios.post(
      "https://api.imgbb.com/1/upload?key=88428f15dd40d427fa3abee2da85f1e3",
      form,
      { headers: form.getHeaders() }
    );

    fs.unlinkSync(tempFile);

    const imageUrl = response?.data?.data?.url;
    if (!imageUrl) throw new Error("❌ Upload failed.");

    const size = buffer.length;
    const buttons = [
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "📋 Copy Image URL",
          id: "copy_uploaded_url",
          copy_code: imageUrl
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "",
          id: botPrefix + ""
        })
      }
    ];

    const msg = {
      image: { url: imageUrl },
      caption: `✅ *Image uploaded successfully!*\n\n📦 *Size:* ${size} byte(s)\n🌐 *URL:* ${imageUrl}`,
      title: "🖼️ Upload to URL",
      footer: "© Uploaded by ✨° 𝐃ɪɴᴜ x ʟɪᴛ𝐄 ° ✨",
      interactiveButtons: buttons
    };

    await conn.sendMessage(from, msg, { quoted: mek });

  } catch (err) {
    console.error("tourl error:", err);
    await reply("❌ " + err.message);
  }
});