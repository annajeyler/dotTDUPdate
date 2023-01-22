const winston = require('winston');
const fs = require('fs');
require('winston-daily-rotate-file');

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const tsFormat = () => new Date().toLocaleTimeString();

const transport = new (winston.transports.DailyRotateFile)({
  filename: `${logDir}/%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const logger = winston.createLogger({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: env === 'development' ? 'debug' : 'info',
      prettyPrint: (env === 'development'),
    }),
    transport
  ],
});

module.exports = logger;
