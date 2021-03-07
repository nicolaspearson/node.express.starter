import request from 'supertest';

import App from '@/app';
import * as env from '@/env';

export type HttpMethod = 'delete' | 'get' | 'patch' | 'post' | 'put';

function createRequest(
  method: HttpMethod,
  url: string,
  bearer?: string,
  contentType?: RegExp | null
): request.Test {
  env.init();
  const app = new App();
  const testApp = request(app.getExpressApp())
    [method](url)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  if (bearer) void testApp.set('Authorization', bearer);
  if (contentType) void testApp.expect('Content-Type', contentType);
  return testApp;
}

export const testApp = {
  delete: (url: string, bearer?: string): request.Test =>
    createRequest('delete', url, bearer, undefined),
  get: (url: string, bearer?: string, contentType = /json/): request.Test =>
    createRequest('get', url, bearer, contentType),
  patch: (url: string, bearer?: string, contentType: RegExp | null = /json/): request.Test =>
    createRequest('patch', url, bearer, contentType),
  post: (url: string, bearer?: string, contentType = /json/): request.Test =>
    createRequest('post', url, bearer, contentType),
  put: (url: string, bearer?: string, contentType = /json/): request.Test =>
    createRequest('put', url, bearer, contentType),
};
