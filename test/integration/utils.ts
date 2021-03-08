import request from 'supertest';

export function getTokenStringFromCookieResponse(response: request.Response): string {
  return response.header['set-cookie'][0].replace('Authorization=', '').split(';')[0];
}
