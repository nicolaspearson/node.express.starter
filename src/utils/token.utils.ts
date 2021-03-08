import Boom from 'boom';
import express from 'express';

import { Token } from '@/common/models/token.model';
import { User } from '@/db/entities/user.entity';

export function createTokenPayload(user: User): Api.TokenPayload {
  const expiresIn = 60 * 60; // 1 hour
  const jwtPayload: Api.JwtPayload = {
    id: user.id,
  };
  // Generate a token
  const token = new Token();
  token.expiresIn = expiresIn;
  token.generateToken(jwtPayload);
  return token;
}

export function getTokenStringFromRequest(req: express.Request): string {
  const authorizationHeader = req.headers.authorization as string;
  if (!authorizationHeader) {
    throw Boom.unauthorized('Authorization header is missing from the request.');
  }
  return authorizationHeader.split('Bearer ')[1];
}
