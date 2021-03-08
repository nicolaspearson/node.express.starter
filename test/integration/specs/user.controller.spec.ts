import { Connection } from 'typeorm';

import { LoginReqDto, RegisterUserReqDto } from '@/common/dto';

import { closeConnections, setupDatabase } from '../db';
import { testApp } from '../factories';

describe('User Controller', () => {
  const baseUrl = '/user';
  let connection: Connection;

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
});
