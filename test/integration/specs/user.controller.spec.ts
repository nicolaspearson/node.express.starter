import { Connection } from 'typeorm';

import { LoginReqDto, RegisterUserReqDto } from '@/common/dto';

import { closeConnections, setupDatabase } from '../db';
import { testApp } from '../factories';
import { getTokenStringFromCookieResponse } from '../utils';

describe('User Controller', () => {
  const baseUrl = '/user';
  let connection: Connection;
  let tokenString: string;

  const registerUserReqDto: RegisterUserReqDto = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com' as Email,
    password: 'testing',
  };

  const loginReqDto: LoginReqDto = {
    email: 'john.doe@test.com' as Email,
    password: 'testing',
  };

  beforeAll(async () => {
    connection = await setupDatabase('int_user');
  });

  afterAll(async () => {
    await closeConnections(connection);
    jest.resetAllMocks();
  });

  describe(`POST ${baseUrl}/register`, () => {
    describe('if the user does not exist', () => {
      test('response should have the Set-Cookie header with the Authorization token', async () => {
        const response = await testApp
          .post(`${baseUrl}/register`)
          .send(registerUserReqDto)
          .expect(201)
          .expect('Set-Cookie', /^Authorization=.+/);
        expect(JSON.parse(response.text)).toMatchObject({
          id: expect.any(Number),
          email: registerUserReqDto.email,
          enabled: true,
          firstName: registerUserReqDto.firstName,
          lastName: registerUserReqDto.lastName,
        });
      });

      describe('if the user exists', () => {
        test('response should be a 409', async () => {
          const response = await testApp.post(`${baseUrl}/register`).send(registerUserReqDto);
          expect(response.status).toEqual(409);
        });
      });
    });
  });

  describe(`POST ${baseUrl}/login`, () => {
    describe('if the user exists', () => {
      test('response should have the Set-Cookie header with the Authorization token', async () => {
        const response = await testApp
          .post(`${baseUrl}/login`)
          .send(loginReqDto)
          .expect(200)
          .expect('Set-Cookie', /^Authorization=.+/);
        tokenString = getTokenStringFromCookieResponse(response);
        expect(JSON.parse(response.text)).toMatchObject({
          id: expect.any(Number),
          email: registerUserReqDto.email,
          enabled: true,
          firstName: registerUserReqDto.firstName,
          lastName: registerUserReqDto.lastName,
        });
      });
    });

    describe('if the user does not exist', () => {
      test('response should be a 404', async () => {
        const response = await testApp
          .post(`${baseUrl}/login`)
          .send({ ...loginReqDto, email: 'new.user@test.com' });
        expect(response.status).toEqual(404);
      });
    });
  });

  describe(`GET ${baseUrl}/:id`, () => {
    describe('if the user exists', () => {
      test('response should return the user', async () => {
        const response = await testApp
          .get(`${baseUrl}/1`)
          .set('Authorization', ` Bearer ${tokenString}`)
          .expect(200);
        expect(JSON.parse(response.text)).toMatchObject({
          id: 1,
          email: expect.any(String),
          enabled: expect.any(Boolean),
          firstName: expect.any(String),
          lastName: expect.any(String),
        });
      });
    });

    describe('if the user does not exist', () => {
      test('response should be a 404', async () => {
        const response = await testApp
          .get(`${baseUrl}/999`)
          .set('Authorization', ` Bearer ${tokenString}`);
        expect(response.status).toEqual(404);
      });
    });
  });
});
