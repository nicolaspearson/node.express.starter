import * as winston from 'winston';

export let logger: winston.Logger;

export function init(): void {
  // Configure levels and transports, and set local variable
  logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.align()
    ),
    levels: getCustomLogLevels().levels,
    transports: [
      new winston.transports.File({
        filename: `./logs/debug.log`,
        level: 'debug',
      }),
      new winston.transports.File({
        filename: `./logs/info.log`,
        level: 'info',
      }),
      new winston.transports.File({
        filename: `./logs/warn.log`,
        level: 'warning',
      }),
      new winston.transports.File({
        filename: `./logs/error.log`,
        level: 'error',
        handleExceptions: true,
      }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.colorize(),
          winston.format.align(),
          winston.format.printf((info) => {
            let msg = `${info.timestamp}`;
            msg = `${msg}: ${info.level}`;
            msg = `${msg}: ${info.message.trim()}`;
            return msg;
          })
        ),
      })
    );
  }
  // Add custom colours
  winston.addColors(getCustomLogLevels().colors);
  logger.debug('Logger: Ready!');
}

function getCustomLogLevels() {
  return {
    levels: {
      error: 1,
      warn: 2,
      info: 3,
      verbose: 4,
      debug: 5,
      silly: 6,
    },
    colors: {
      error: 'red',
      warn: 'orange',
      info: 'yellow',
      debug: 'blue',
      verbose: 'white',
      silly: 'purple',
    },
  };
}
