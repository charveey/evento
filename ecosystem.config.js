module.exports = {
  apps: [
    {
      name: 'evento-prod',

      // `next start` is the correct command for a built Next.js app
      script: 'node_modules/.bin/next',
      args: 'start',

      cwd: '/srv/www/evento',

      // Logging
      out_file: '/srv/www/evento/logs/out-prod.log',
      error_file: '/srv/www/evento/logs/error-prod.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',

      // Restart policy
      watch: false,
      max_restarts: 5,
      restart_delay: 3000,

      env: {
        PORT: 3000,
        NODE_ENV: 'production',
        // Env vars are read from .env.local by Next.js at runtime.
        // No need to duplicate them here.
      },
    },
  ],
};