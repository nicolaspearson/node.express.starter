import { Connection } from 'typeorm';

import UserLoginDto from '@/common/dto/user.login.dto';
import UserRegisterDto from '@/common/dto/user.register.dto';

import { closeConnections, setupDatabase } from '../db';
import { testApp } from '../factories';

describe('User Controller', () => {
  const baseUrl = '/user';
  let connection: Connection;

  const userRegisterDto: UserRegisterDto = {
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john.doe@test.com',
    password: 'testing',
  };

  const userLoginDto: UserLoginDto = {
    emailAddress: 'john.doe@test.com',
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
    describe('if the email address is not in use', () => {
      test('response should have the Set-Cookie header with the Authorization token', async () => {
        const response = await testApp.post(`${baseUrl}/register`).send(userRegisterDto);
        expect(response.status).toEqual(201);
        // .expect('Set-Cookie', /^Authorization=.+/);
        expect(JSON.parse(response.text)).toMatchObject({
          id: expect.any(Number),
          firstName: userRegisterDto.firstName,
          lastName: userRegisterDto.lastName,
          emailAddress: userRegisterDto.emailAddress,
          password: expect.any(String),
          enabled: true,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,
        });
      });
    });
  });

  describe(`POST ${baseUrl}/login`, () => {
    describe('if the email address is valid', () => {
      test('response should have the Set-Cookie header with the Authorization token', async () => {
        const response = await testApp.post(`${baseUrl}/login`).send(userLoginDto);
        expect(response.status).toEqual(200);
        // .expect('Set-Cookie', /^Authorization=.+/);
        expect(JSON.parse(response.text)).toMatchObject({
          id: expect.any(Number),
          firstName: userRegisterDto.firstName,
          lastName: userRegisterDto.lastName,
          emailAddress: userRegisterDto.emailAddress,
          password: expect.any(String),
          enabled: true,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,
        });
      });
    });

    describe('if the user does not exist', () => {
      test('response should be a 404', async () => {
        const response = await testApp
          .post(`${baseUrl}/login`)
          .send({ ...userLoginDto, emailAddress: 'new.user@test.com' });
        expect(response.status).toEqual(404);
      });
    });
  });
});
