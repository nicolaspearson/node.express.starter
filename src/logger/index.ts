import { Ewl, LogLevel } from 'ewl';
import { Application } from 'express';

export let ewl: Ewl;

export function initEwl(app: Application): void {
  ewl = new Ewl({
    enableRequestLogging: true,
    environment: process.env.NODE_ENV || 'development',
    label: 'app',
    logLevel: (process.env.LOG_LEVEL as LogLevel) || 'error',
    requestLoggingOptions: {
      colorize: process.env.NODE_ENV === 'development',
    },
    useLogstashFormat: false,
    version: process.env.VERSION || 'local',
  });

  // Use the context middleware for request id injection
  app.use(ewl.contextMiddleware);

  // Use request middleware to inject express metadata.
  app.use(ewl.requestMiddleware!);
}
