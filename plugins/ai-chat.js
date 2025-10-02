/**
 * DeepSeek Command Plugin
 * Copyright © 2025 DarkSide Developers
 */

const axios = require("axios");

module.exports = async (socket, msg, bot, { q, react, reply }) => {
    try {
        if (!q) {
            return reply("Please provide a message for DeepSeek AI.\nExample: `.deepseek Hello`");
        }

        // API Call
        const apiUrl = `https://api.ryzendesu.vip/api/ai/deepseek?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.answer) {
            await react("❌");
            return reply("DeepSeek AI failed to respond. Please try again later.");
        }

        // Format response
        const deepMessage = `
╭─────────────────────╮
│    🧠 DEEPSEEK AI    │
│       RESPONSE        │
╰─────────────────────╯

💬 *Your Question:* 
${q}

🧠 *DeepSeek Response:* 
${data.answer}

*© 2025 DarkSide Developers*
*Owner: DarkWinzo*
        `.trim();

        await socket.sendMessage(
            msg.key.remoteJid,
            { text: deepMessage },
            { quoted: msg }
        );

        await react("✅");

        // Update statistics
        const stats = bot.statistics || {};
        stats.deepseekQueries = (stats.deepseekQueries || 0) + 1;
        await bot.update({ statistics: stats });

    } catch (error) {
        console.error("DeepSeek command error:", error);
        await socket.sendMessage(
            msg.key.remoteJid,
            { text: "❌ Error executing DeepSeek AI command" },
            { quoted: msg }
        );
        await react("❌");
    }
};
