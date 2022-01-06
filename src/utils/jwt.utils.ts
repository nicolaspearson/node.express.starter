import Boom from 'boom';
import express from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

import { logger } from '@/logger';

export function generateJwtTokens(jwtPayload: Api.JwtPayload): Api.JwtTokens {
  const accessTokenOptions: jsonwebtoken.SignOptions = {
    expiresIn: process.env.JWT_EXPIRATION,
  };
  const accessToken = signJwt(jwtPayload, accessTokenOptions);
  return { accessToken: { jwtString: accessToken, options: accessTokenOptions } };
}

export function getJwtFromRequest(jwtString: JwtString): Api.Jwt {
  try {
    const base64Payload = jwtString.split('.')[1];
    const decodedPayload = Buffer.from(base64Payload, 'base64');
    const jwt: Api.Jwt = JSON.parse(decodedPayload.toString());
    // We need our payload to always have the following properties
    if (!jwt.id) {
      // Use a generic error message
      throw new Error('Malformed payload');
    }
    return verifyJwt(jwtString) as Api.Jwt;
  } catch (error) {
    logger.debug(`Request is missing a valid jwt: ${(error as Error).message}`);
    throw Boom.unauthorized('Invalid jwt provided.');
  }
}

export function getJwtStringFromRequest(req: express.Request): JwtString {
  const authorizationHeader = req.headers.authorization as string;
  if (!authorizationHeader) {
    throw Boom.unauthorized('Authorization header is missing from the request.');
  }
  return authorizationHeader.split('Bearer ')[1] as JwtString;
}

export function signJwt(jwtPayload: Api.JwtPayload, options: jsonwebtoken.SignOptions): JwtString {
  return jsonwebtoken.sign(jwtPayload, process.env.JWT_SECRET!, options) as JwtString;
}

export function verifyJwt(jwtString: JwtString): string | unknown {
  return jsonwebtoken.verify(jwtString, process.env.JWT_SECRET!, { ignoreExpiration: false });
}
