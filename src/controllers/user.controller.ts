import * as express from 'express';

import LoginUserDto from '@/dto/user.login.dto';
import RegisterUserDto from '@/dto/user.register.dto';
import Controller from '@/interfaces/controller.interface';
import validationMiddleware from '@/middleware/validation.middleware';
import UserRepository from '@/repositories/user.repository';
import UserService from '@/services/user.service';

export default class UserController implements Controller {
  public path = '/user';
  public router = express.Router();
  public userService = new UserService(new UserRepository());

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(RegisterUserDto),
      this.registration
    );
    this.router.post(`${this.path}/login`, validationMiddleware(LoginUserDto), this.login);
  }

  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: RegisterUserDto = request.body;
    try {
      const { cookie, user } = await this.userService.register(userData);
      response.setHeader('Set-Cookie', [cookie]);
      response.send(user);
    } catch (error) {
      next(error);
    }
  };

  private login = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: LoginUserDto = request.body;
    try {
      const { cookie, user } = await this.userService.login(userData);
      response.setHeader('Set-Cookie', [cookie]);
      response.send(user);
    } catch (error) {
      next(error);
    }
  };
}
