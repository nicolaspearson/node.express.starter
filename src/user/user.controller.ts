import * as express from 'express';

import LoginUserDto from '@/common/dto/user.login.dto';
import RegisterUserDto from '@/common/dto/user.register.dto';
import validationMiddleware from '@/middleware/validation.middleware';
import { login, register } from '@/user/user.service';

/**
 * POST /user/login
 *
 * @param req The http request.
 * @param res The http response.
 */
async function postLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const loginUserDto: LoginUserDto = req.body;
    const { cookie, user } = await login(loginUserDto);
    res.status(200).json(user).setHeader('Set-Cookie', [cookie]);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /user/register
 *
 * @param req The http request.
 * @param res The http response.
 */
async function postRegister(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const registerUserDto: RegisterUserDto = req.body;
    const { cookie, user } = await register(registerUserDto);
    res.status(201).json(user).setHeader('Set-Cookie', [cookie]);
  } catch (error) {
    next(error);
  }
}

/** The /user routes. */
export default express
  .Router()
  .post(
    '/login',
    validationMiddleware(LoginUserDto, 'Invalid email address or password.'),
    postLogin
  )
  .post(
    '/register',
    validationMiddleware(RegisterUserDto, 'User registration failed.'),
    postRegister
  );
