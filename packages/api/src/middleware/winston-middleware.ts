const expressWinston = require('express-winston');
const winston = require('winston'); // for transports.Console

export const winstonMiddleware = () => {
  return expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  });
};
