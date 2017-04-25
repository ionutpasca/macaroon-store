'use strict';

const fs = require('fs');
const winston = require('winston');
const logDir = 'log';
const ENV = process.env.NODE_ENV || 'development';

if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();

const logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			timestamp: tsFormat,
			colorize: true,
			level: 'info'
		}),
		new (require('winston-daily-rotate-file'))({
			filename: `${logDir}/-results.log`,
			timestamp: tsFormat,
			datePattern: 'yyyy-MM-dd',
			prepend: true,
			level: ENV === 'development' ? 'verbose' : 'info'
		})
	]
});

module.exports = logger;