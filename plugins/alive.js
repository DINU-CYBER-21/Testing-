/**
 * Alive + AI Commands Plugin
 * Copyright © 2025 DarkSide Developers
 */

const axios = require("axios");

module.exports = async (socket, msg, bot) => {
    try {
        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
        const prefix = ".";
        const command = text.startsWith(prefix) ? text.slice(1).split(" ")[0].toLowerCase() : null;
        const args = text.split(" ").slice(1).join(" ");

        // ==== Alive Command ====
        if (command === "alive") {
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);

            const aliveMessage = `
╭─────────────────────╮
│    🤖 QUEEN-MINI    │
│      BOT ALIVE      │
╰─────────────────────╯

📱 *Bot Name:* ${bot.botName}
📞 *Phone:* ${bot.phoneNumber}
⏰ *Uptime:* ${hours}h ${minutes}m ${seconds}s
🔋 *Status:* Online & Active
👑 *Version:* 2.0.0

*© 2025 DarkSide Developers*
*Owner: DarkWinzo*
            `.trim();

            await socket.sendMessage(msg.key.remoteJid, { text: aliveMessage }, { quoted: msg });
        }

        // ==== AI Command (.ai, .bot, .dj, .gpt, .gpt4, .bing) ====
        else if (["ai", "bot", "dj", "gpt", "gpt4", "bing"].includes(command)) {
            if (!args) return socket.sendMessage(msg.key.remoteJid, { text: "⚠️ Provide a question.\nUsage: .ai Hello" }, { quoted: msg });

            const { data } = await axios.get(`https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(args)}`);

            if (!data || !data.message) return socket.sendMessage(msg.key.remoteJid, { text: "❌ AI failed to respond." }, { quoted: msg });

            const aiMessage = `
╭─────────────────────╮
│        🤖 AI BOT        │
│       RESPONSE        │
╰─────────────────────╯

💬 *Your Question:* ${args}
🤖 *AI Response:* ${data.message}
            `.trim();

            await socket.sendMessage(msg.key.remoteJid, { text: aiMessage }, { quoted: msg });
        }

        // ==== OpenAI Command (.openai, .chatgpt, .gpt3, .open-gpt) ====
        else if (["openai", "chatgpt", "gpt3", "open-gpt"].includes(command)) {
            if (!args) return socket.sendMessage(msg.key.remoteJid, { text: "⚠️ Provide a question.\nUsage: .openai Hello" }, { quoted: msg });

            const { data } = await axios.get(`https://vapis.my.id/api/openai?q=${encodeURIComponent(args)}`);

            if (!data || !data.result) return socket.sendMessage(msg.key.remoteJid, { text: "❌ OpenAI failed to respond." }, { quoted: msg });

            const openaiMessage = `
╭─────────────────────╮
│       🧠 OPENAI        │
│       RESPONSE        │
╰─────────────────────╯

💬 *Your Question:* ${args}
🧠 *OpenAI Response:* ${data.result}
            `.trim();

            await socket.sendMessage(msg.key.remoteJid, { text: openaiMessage }, { quoted: msg });
        }

        // ==== DeepSeek Command (.deepseek, .deep, .seekai) ====
        else if (["deepseek", "deep", "seekai"].includes(command)) {
            if (!args) return socket.sendMessage(msg.key.remoteJid, { text: "⚠️ Provide a question.\nUsage: .deepseek Hello" }, { quoted: msg });

            const { data } = await axios.get(`https://api.ryzendesu.vip/api/ai/deepseek?text=${encodeURIComponent(args)}`);

            if (!data || !data.answer) return socket.sendMessage(msg.key.remoteJid, { text: "❌ DeepSeek AI failed to respond." }, { quoted: msg });

            const deepseekMessage = `
╭─────────────────────╮
│     🔎 DEEPSEEK BOT    │
│       RESPONSE        │
╰─────────────────────╯

💬 *Your Question:* ${args}
🔎 *DeepSeek Answer:* ${data.answer}
            `.trim();

            await socket.sendMessage(msg.key.remoteJid, { text: deepseekMessage }, { quoted: msg });
        }

    } catch (error) {
        console.error("Command error:", error);
        await socket.sendMessage(msg.key.remoteJid, { text: "❌ Error executing command." }, { quoted: msg });
    }
};
