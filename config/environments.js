module.exports = {
  development: {
    port: 3000,
    autoSave: true,
    saveInterval: 30000,
    logLevel: 'debug',
    cors: true
  },
  production: {
    port: process.env.PORT || 8080,
    autoSave: true,
    saveInterval: 60000,
    logLevel: 'error',
    cors: false
  }
};
