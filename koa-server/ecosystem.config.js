module.exports = {
  apps: [{
    // Main property
    name: 'koa-server',
    script: 'index.js',

    node_args: '-r esm',

    // Advanced

    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '500M',
    watch: '.',
    ignore_watch: ['public/*'],

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/

    autorestart: true,
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }],

  deploy: {
    production: {},
  },
};
