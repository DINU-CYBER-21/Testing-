/**
 * AI Command Plugin
 * Copyright © 2025 DarkSide Developers
 */

const axios = require("axios");

module.exports = async (socket, msg, bot, { q, react, reply }) => {
    try {
        if (!q) {
            return reply("Please provide a message for the AI.\nExample: `.ai Hello`");
        }

        // API Call
        const apiUrl = `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.message) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        // Format response (Alive style)
        const aiMessage = `
╭─────────────────────╮
│        🤖 AI BOT        │
│       RESPONSE        │
╰─────────────────────╯

💬 *Your Question:* 
${q}

🤖 *AI Response:* 
${data.message}

*© 2025 DarkSide Developers*
*Owner: DarkWinzo*
        `.trim();

        await socket.sendMessage(
            msg.key.remoteJid,
            { text: aiMessage },
            { quoted: msg }
        );

        await react("✅");

        // Update statistics
        const stats = bot.statistics || {};
        stats.aiQueries = (stats.aiQueries || 0) + 1;
        await bot.update({ statistics: stats });

    } catch (error) {
        console.error("AI command error:", error);
        await socket.sendMessage(
            msg.key.remoteJid,
            { text: "❌ Error executing AI command" },
            { quoted: msg }
        );
        await react("❌");
    }
};
