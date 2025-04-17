const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.printf(({ message }) => message),
    }),
    new winston.transports.File({
      filename: (function () {
        const date = new Date();
        const logFile = `logs/${date.getDate()}_${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}_${date.getFullYear()}.log`;

        return logFile;
      })(),
    }),
  ],
});

module.exports = logger;
