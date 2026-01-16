// PM2 Configuration for Solar Expert Backend
// This file is used to manage the backend server with PM2 process manager

module.exports = {
  apps: [{
    name: 'solar-expert-backend',
    script: './backend/server.js',
    instances: 'max', // Use all available CPU cores
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/backend-error.log',
    out_file: './logs/backend-out.log',
    log_file: './logs/backend-combined.log',
    time: true,
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    listen_timeout: 3000,
    kill_timeout: 5000
  }]
};

/*
Usage:

Development:
pm2 start ecosystem.config.js

Production:
pm2 start ecosystem.config.js --env production

Other commands:
pm2 list                    # List all processes
pm2 logs solar-expert-backend  # View logs
pm2 restart solar-expert-backend  # Restart
pm2 stop solar-expert-backend     # Stop
pm2 delete solar-expert-backend   # Delete
pm2 monit                   # Monitor
pm2 save                    # Save process list
pm2 startup                 # Setup auto-start on boot
*/
