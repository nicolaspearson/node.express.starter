import { Ewl, LogLevel } from 'ewl';
import { Application } from 'express';

export let ewl: Ewl;

export function initEwl(app: Application): void {
  ewl = new Ewl({
    environment: process.env.ENVIRONMENT || 'development',
    label: 'app',
    logLevel: (process.env.LOG_LEVEL as LogLevel) || 'error',
    useLogstashFormat: false,
    version: process.env.VERSION || 'local',
  });

  // Use the context middleware for request id injection
  app.use(ewl.contextMiddleware);

  // Use express-winston for logging request information
  app.use(
    ewl.createHandler({
      bodyBlacklist: ['accessToken', 'password', 'refreshToken'],
      colorize: true,
      expressFormat: false,
      headerBlacklist: ['cookie', 'token'],
      ignoreRoute: () => false,
      meta: true,
      metaField: 'express',
      msg: 'HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
      requestWhitelist: [
        'headers',
        'method',
        'httpVersion',
        'originalUrl',
        'query',
        'params',
        'url',
      ],
      responseWhitelist: ['headers', 'statusCode'],
      statusLevels: true,
    })
  );
}
