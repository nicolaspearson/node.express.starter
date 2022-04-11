import { Ewl, LogLevel, httpContextMiddleware, requestIdHandler } from 'ewl';
import { Application } from 'express';

export let ewl: Ewl;

export function initEwl(app: Application): void {
  ewl = new Ewl({
    attachRequestId: true,
    environment: process.env.ENVIRONMENT || 'development',
    label: 'app',
    logLevel: (process.env.LOG_LEVEL as LogLevel) || 'error',
    useLogstashFormat: false,
    version: process.env.VERSION || 'local',
  });

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

  // Use express-http-context for context injection (request id)
  app.use(httpContextMiddleware);
  app.use(requestIdHandler);
}
