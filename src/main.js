require('./bot/index.js');
require('./website.js');

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);
