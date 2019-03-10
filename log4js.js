// require Log4js
const log4js = require('log4js');

// Logger configuration
log4js.configure({
    appenders: { fileAppender: { type: 'file', filename: './log4js.log' } },
    categories: { default: { appenders: ['fileAppender'], level: 'info' } }
});

// Create the logger
const log4jslogger = log4js.getLogger();

module.exports = log4jslogger;
