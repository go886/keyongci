module.exports = {
  apps : [{
    name: 'blog',
    script: './server/main.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '3080',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '300M',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'go886',
      host : '192.168.2.104',
      ref  : 'origin/master',
      repo : 'git@192.168.2.104:go886/blog.git',
      path : '/volume1/web/blog',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
