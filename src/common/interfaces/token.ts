import * as jwt from 'jsonwebtoken';

import TokenContents from '@/common/interfaces/token-contents.interface';
import * as env from '@/env';

export default class Token {
  constructor(token?: string) {
    if (token) {
      this.token = token;
    }
  }
  public token: string;

  public expiresIn?: number | string;

  public generateToken(contents: TokenContents): void {
    this.token = jwt.sign(contents, env.get().JWT_SECRET, this.getTokenSigningOptions());
  }

  private getTokenSigningOptions(): jwt.SignOptions {
    return { expiresIn: this.expiresIn || env.get().JWT_EXPIRATION };
  }

  public verifyToken(): string | unknown {
    return jwt.verify(this.token, env.get().JWT_SECRET, { ignoreExpiration: false });
  }
}
