import * as jwt from 'jsonwebtoken';

export default class Token {
  public expiresIn?: number | string;
  public tokenString: string;

  constructor(token?: string) {
    if (token) {
      this.tokenString = token;
    }
  }

  public generateToken(contents: Api.TokenContents): void {
    this.tokenString = jwt.sign(contents, process.env.JWT_SECRET!, this.getTokenSigningOptions());
  }

  private getTokenSigningOptions(): jwt.SignOptions {
    return { expiresIn: this.expiresIn || process.env.JWT_EXPIRATION };
  }

  public verifyToken(): string | unknown {
    return jwt.verify(this.tokenString, process.env.JWT_SECRET!, { ignoreExpiration: false });
  }
}
