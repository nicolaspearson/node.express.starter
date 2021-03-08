import * as express from 'express';

import UserLoginDto from '@/common/dto/user.login.dto';
import UserRegisterDto from '@/common/dto/user.register.dto';
import validationMiddleware from '@/middleware/validation.middleware';
import { login, register } from '@/user/user.service';
import { safe } from '@/utils/express.utils';

/**
 * POST /user/login
 *
 * @param req The http request.
 * @param res The http response.
 */
async function postLogin(req: express.Request, res: express.Response) {
  const userLoginDto: UserLoginDto = req.body;
  const { cookie, user } = await login(userLoginDto);
  res.setHeader('Set-Cookie', [cookie]);
  res.status(200).json(user);
}

/**
 * POST /user/register
 *
 * @param req The http request.
 * @param res The http response.
 */
async function postRegister(req: express.Request, res: express.Response) {
  const userRegisterDto: UserRegisterDto = req.body;
  const { cookie, user } = await register(userRegisterDto);
  res.setHeader('Set-Cookie', [cookie]);
  res.status(201).json(user);
}

/** The /user routes. */
export default express
  .Router()
  .post(
    '/login',
    validationMiddleware(UserLoginDto, 'Invalid email address or password.'),
    safe(postLogin)
  )
  .post(
    '/register',
    validationMiddleware(UserRegisterDto, 'User registration failed.'),
    safe(postRegister)
  );
