import * as express from 'express';

import { LoginReqDto, RegisterUserReqDto, UserResDto } from '@/common/dto';
import { validationMiddleware } from '@/middleware/validation.middleware';
import { login, register } from '@/user/user.service';
import { safe } from '@/utils/express.utils';

/**
 * POST /user/login
 *
 * @param req The http request.
 * @param res The http response.
 */
async function postLogin(req: express.Request, res: express.Response) {
  const loginReqDto: LoginReqDto = req.body;
  const { cookie, user } = await login(loginReqDto);
  res.setHeader('Set-Cookie', [cookie]);
  res.status(200).json(new UserResDto(user));
}

/**
 * POST /user/register
 *
 * @param req The http request.
 * @param res The http response.
 */
async function postRegister(req: express.Request, res: express.Response) {
  const registerUserReqDto: RegisterUserReqDto = req.body;
  const { cookie, user } = await register(registerUserReqDto);
  res.setHeader('Set-Cookie', [cookie]);
  res.status(201).json(new UserResDto(user));
}

/** The /user routes. */
export default express
  .Router()
  .post(
    '/login',
    validationMiddleware(LoginReqDto, 'Invalid email address or password.'),
    safe(postLogin)
  )
  .post(
    '/register',
    validationMiddleware(RegisterUserReqDto, 'User registration failed.'),
    safe(postRegister)
  );
