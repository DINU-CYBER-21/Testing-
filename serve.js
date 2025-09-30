const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Simple keep-alive route
app.get("/", (req, res) => {
  res.send("Queen Mini WhatsApp Bot is running ✅");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});

// ---- Bot main file import (if you have one) ----
require("./index.js"); // <-- if your bot logic in bot.js
