const app = require('./src/app');
const config = require('./config/environments')[process.env.NODE_ENV || 'development'];

app.listen(config.port, () => {
  console.log(`Game server running on port ${config.port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
