module.exports = {
  apps: [{
    // Main property
    name: 'koa-server',
    script: 'index.js',
    // Fix broken esm support for the node v14
    node_args: '--experimental-specifier-resolution=node',

    // Advanced
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '1000M',
    watch: '.',
    ignore_watch: ['public/*'],

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    autorestart: true,
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
      REDIS_HOST: 'm1-redis',
      REDIS_PORT: 6379,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      REDIS_HOST: 'm1-redis',
      REDIS_PORT: 6379,
    },
  }],

  deploy: {
    production: {},
  },
};
