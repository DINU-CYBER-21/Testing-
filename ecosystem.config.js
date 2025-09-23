module.exports = {
  apps: [
    {
      name: "queen-mini",           // PM2 process name
      script: "server.js",          // main server file
      instances: 1,                 // single instance
      autorestart: true,            // restart on crash
      watch: false,                 // no file watch
      max_memory_restart: "500M",   // restart if memory exceeds
      // Cron-based restart every 50 minutes
      cron_restart: "*/50 * * * *",
      env: {
        NODE_ENV: "production",
        PORT: 3000                 // set to your config.PORT if needed
      }
    }
  ]
};
