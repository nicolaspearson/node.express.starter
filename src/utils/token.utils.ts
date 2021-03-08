import Token from '@/common/models/token.model';
import User from '@/db/entities/user.entity';

export function createToken(user: User): Token {
  const expiresIn = 60 * 60; // 1 hour
  const tokenContents: Api.TokenContents = {
    id: user.id,
  };
  // Generate a token
  const token: Token = new Token();
  token.expiresIn = expiresIn;
  token.generateToken(tokenContents);
  return token;
}
