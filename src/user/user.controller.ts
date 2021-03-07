import * as express from 'express';

import UserLoginDto from '@/common/dto/user.login.dto';
import UserRegisterDto from '@/common/dto/user.register.dto';
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
    const userLoginDto: UserLoginDto = req.body;
    const { cookie, user } = await login(userLoginDto);
    res.setHeader('Set-Cookie', [cookie]);
    res.status(200).json(user);
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
    const userRegisterDto: UserRegisterDto = req.body;
    const { cookie, user } = await register(userRegisterDto);
    res.setHeader('Set-Cookie', [cookie]);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

/** The /user routes. */
export default express
  .Router()
  .post(
    '/login',
    validationMiddleware(UserLoginDto, 'Invalid email address or password.'),
    postLogin
  )
  .post(
    '/register',
    validationMiddleware(UserRegisterDto, 'User registration failed.'),
    postRegister
  );
