// const { createLogger, format, transports } = require("winston");
// const { combine, timestamp, printf } = format;

// const myFormat = printf(({ level, message, timestamp }) => {
//   return `${timestamp} ${level}: ${message}`;
// });

// const logger = createLogger({
//   level: "info",
//   format: combine(timestamp(), myFormat),
//   transports: [
//     new transports.Console(),
//     new transports.File({ filename: "logs/error.log", level: "error" }),
//     new transports.File({ filename: "logs/combined.log" }),
//   ],
// });

// module.exports = logger;

const fs = require("fs");
const path = require("path");
const winston = require("winston");

// Ensure the logs directory exists
const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
    new winston.transports.File({ filename: path.join(logDir, "combined.log") }),
  ],
});

// If in development, log to the console
if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
