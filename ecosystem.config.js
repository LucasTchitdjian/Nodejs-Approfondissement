module.exports = {
  apps : [{
    name: 'myapp',
    script: 'server.js',

    // détails de déploiement

    error_file: './logs/err.log',

    max_memory_restart: '200M',

    instances: 3,

    exec_mode: 'cluster'
  }]
}